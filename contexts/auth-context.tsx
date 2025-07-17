// yeongkyukang/bozhiymirchurch/BozhiymirChurch-a6add0b3b500ff96955c66318b3b02ce7b47931a/contexts/auth-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

// UserProfile 인터페이스를 이전 파일에서 가져와 통합
interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "user" | "child"; // 'permission' 대신 'role' 사용
  nickname: string | null;
  gender: "male" | "female" | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
  can_comment: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null; // 사용자 프로필 정보 추가
  userRole: "admin" | "user" | "child" | null; // 'user' | 'admin' 대신 'admin' | 'user' | 'child' 사용
  loading: boolean;
  signIn: (email: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, nickname: string, gender: string, code: string) => Promise<{ error: any | null }>; // 변경됨: 5개 인수로 변경 및 반환 타입 명시
  signOut: () => Promise<any>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<{ data?: any; error: any | null }>; // 변경됨: Partial<UserProfile>로 타입 강화
  uploadProfilePicture: (file: File) => Promise<{ error: any; url?: string }>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user" | "child" | null>(null);
  const [loading, setLoading] = useState(true);

  // fetchUserProfile 함수를 업데이트된 users 테이블 스키마에 맞게 조정
  const fetchUserProfile = useCallback(async (userId?: string) => {
    const idToFetch = userId || user?.id;
    if (!idToFetch) {
      setUserProfile(null);
      setUserRole(null);
      return;
    }

    try {
      // 'profiles' 대신 'users' 테이블 사용 및 모든 필드 선택
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", idToFetch)
        .single();

      if (error && error.code === 'PGRST116') { // Profile not found
        console.log("Profile not found in public.users, creating it now.");
        // Create a new user profile with basic info
        const { data: newUserProfile, error: createError } = await supabase
          .from("users")
          .insert({ id: idToFetch, email: user?.email || '', role: 'user', can_comment: false })
          .select()
          .single();

        if (createError) {
          console.error("Error creating new user profile:", createError);
        } else {
          setUserProfile(newUserProfile as UserProfile);
          setUserRole(newUserProfile.role);
        }
      } else if (data) {
        setUserProfile(data as UserProfile); // 타입 캐스팅
        setUserRole(data.role); // 'permission' 대신 'role' 사용
      } else {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
      setUserRole(null);
    }
  }, [user?.id]); // user?.id 의존성 추가

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const signIn = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return data;
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, nickname: string, gender: string, code: string): Promise<{ error: any | null }> => { // 변경됨: 5개 인수로 변경
    // 1. Validate registration code and get role
    const { data: codeData, error: codeError } = await supabase
        .from('registration_codes')
        .select('*')
        .eq('code', code)
        .eq('is_used', false)
        .single();
    
    if (codeError || !codeData) {
        return { error: { message: 'Invalid or already used registration code.' } };
    }
    
    const assignedRole = codeData.role as "admin" | "user" | "child";
    let canCommentStatus = false;
    if (assignedRole === 'admin') {
        canCommentStatus = true; // Admins are approved for commenting by default
    }
    // Note: Other roles require manual admin approval to set can_comment to true.
    
    // 2. Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
        return { error };
    }

    if (data.user) {
        // 3. Update the user profile with nickname, gender, role, and comment permission
        // 'profiles' 대신 'users' 테이블 사용 및 필드 조정
        const { error: profileError } = await supabase
            .from("users")
            .update({
                nickname,
                gender: gender as "male" | "female",
                role: assignedRole, // 'permission' 대신 'role' 사용
                can_comment: canCommentStatus // Set initial commenting permission
            })
            .eq("id", data.user.id);

        if (profileError) {
            console.error("Error updating profile:", profileError);
            // Optionally, delete the user if profile update fails to avoid dangling accounts
            await supabase.auth.admin.deleteUser(data.user.id);
            return { error: profileError };
        }
        
        // 4. Mark the registration code as used
        const { error: updateCodeError } = await supabase
            .from('registration_codes')
            .update({ is_used: true, used_by_user_id: data.user.id, used_at: new Date().toISOString() })
            .eq('code', code);
            
        if (updateCodeError) {
            console.error("Error updating registration code:", updateCodeError);
            // This is a non-critical error, but good to log
        }
    }

    return { error: null }; // 성공 시 error: null 반환
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setUserRole(null);
  };

  // updateUserProfile 함수 로직은 이전과 동일하게 유지 (error/data 객체 반환)
  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<{ data?: any; error: any | null }> => {
    if (!user) {
      return { error: new Error("User not logged in.") };
    }
    // 'profiles' 대신 'users' 테이블 사용
    const { data, error } = await supabase
      .from("users")
      .update(profileData)
      .eq("id", user.id);

    if (error) {
        console.error("Error updating user profile in DB:", error);
        return { error };
    }
    await fetchUserProfile(user.id);
    return { data, error: null };
  };

  const uploadProfilePicture = async (file: File) => {
    if (!user) return { error: new Error("User not logged in.") };

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file);

    if (uploadError) {
      return { error: uploadError };
    }

    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    const { error: updateError } = await updateUserProfile({
      profile_picture_url: publicUrl,
    });

    return { error: updateError, url: publicUrl };
  };

  const value = {
    user,
    session,
    userProfile,
    userRole,
    loading,
    signIn,
    signInWithPassword,
    signUp,
    signOut,
    updateUserProfile,
    uploadProfilePicture,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
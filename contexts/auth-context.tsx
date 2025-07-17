// yeongkyukang/bozhiymirchurch/BozhiymirChurch-a6add0b3b500ff96955c66318b3b02ce7b47931a/contexts/auth-context.tsx
"use client"; // 변경됨: "use client" 지시어 추가

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null; // 사용자 프로필 정보 추가
  userRole: "user" | "admin" | null; // 사용자 역할 추가
  loading: boolean;
  signIn: (email: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, nickname: string) => Promise<any>; // 닉네임 추가
  signOut: () => Promise<any>;
  updateUserProfile: (profileData: any) => Promise<{ data?: any; error: any | null }>; // 변경됨: 반환 타입 수정
  uploadProfilePicture: (file: File) => Promise<{ error: any; url?: string }>; // 변경됨: uploadProfilePicture 타입 정의 추가
  fetchUserProfile: () => Promise<void>; // 프로필 가져오는 함수 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId?: string) => {
    const idToFetch = userId || user?.id;
    if (!idToFetch) {
      setUserProfile(null);
      setUserRole(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("nickname, permission")
        .eq("id", idToFetch)
        .single();

      if (error) throw error;
      if (data) {
        setUserProfile(data);
        setUserRole(data.permission);
      } else {
        setUserProfile(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
      setUserRole(null);
    }
  }, [user?.id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
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

  const signUp = async (email: string, password: string, nickname: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        nickname,
        permission: "user",
      });
      if (profileError) throw profileError;
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setUserRole(null);
  };

  const updateUserProfile = async (profileData: any): Promise<{ data?: any; error: any | null }> => { // 변경됨: 반환 타입 명시 및 로직 수정
    if (!user) {
      return { error: new Error("User not logged in.") };
    }
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);

    if (error) {
        console.error("Error updating user profile in DB:", error); // 오류 로깅
        return { error }; // 오류 객체 반환
    }
    await fetchUserProfile(user.id); // 프로필 업데이트 후 최신 정보 다시 가져오기
    return { data, error: null }; // 성공 시 데이터와 null 오류 반환
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

    const { error: updateError } = await updateUserProfile({ // updateUserProfile의 반환 타입이 변경되어 이제 error 속성을 안전하게 접근 가능
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
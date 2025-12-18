"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// DB의 User 프로필 타입
interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "user" | "child" | "guest";
  nickname: string | null;
  gender: "male" | "female" | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
  can_comment: boolean;
  thanks_posts_today?: number;
  last_post_date?: string;
  
  // 변경 제한 기능을 위한 필드
  last_name_change?: string | null;
  last_pw_change?: string | null;
  last_pic_change?: string | null;
}

export interface User extends UserProfile {}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ data: any; error: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  
  signUp: (
    email: string, 
    password: string, 
    nickname: string, 
    gender: string, 
    profileImage?: File | null
  ) => Promise<{ error: any | null }>;
  
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any | null }>;
  updateProfilePicture: (file: File) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
  
  // [수정] 에러 객체를 반환하도록 타입 변경
  registerCode: (code: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      const mergedUser: User = {
        ...data,
        email: authUser.email!,
        id: authUser.id,
      };
      
      setUser(mergedUser);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          if (currentSession?.user) {
            await fetchProfile(currentSession.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (password) {
      return await supabase.auth.signInWithPassword({ email, password });
    } else {
      return await supabase.auth.signInWithOtp({ email });
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signUp = async (
    email: string, 
    password: string, 
    nickname: string, 
    gender: string, 
    profileImage?: File | null
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    if (data.user) {
      let profilePictureUrl = null;

      if (profileImage) {
        try {
          const fileExt = profileImage.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${data.user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(filePath, profileImage);

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('profile-pictures')
              .getPublicUrl(filePath);
            profilePictureUrl = urlData.publicUrl;
          }
        } catch (err) {
          console.error("Image upload error:", err);
        }
      }

      const { error: updateError } = await supabase.from("users").update({ 
        nickname, 
        gender, 
        profile_picture_url: profilePictureUrl 
      }).eq("id", data.user.id);

      if (updateError) return { error: updateError };

      await supabase.auth.signOut();
      setUser(null);
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: { message: "No user logged in" } };

    setUser(prev => prev ? { ...prev, ...updates } : null);

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);
    
    if (error) return { error };
    return { error: null };
  };

  const updateProfilePicture = async (file: File) => {
    if (!user) return { error: { message: "No user logged in" } };

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file);

    if (uploadError) return { error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture_url: publicUrl })
      .eq('id', user.id);

    if (updateError) return { error: updateError };
    
    setUser(prev => prev ? { ...prev, profile_picture_url: publicUrl } : null);

    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  // [수정] registerCode: throw 대신 { error } 반환하여 안전하게 처리
  const registerCode = async (code: string) => {
    if (!user) return { error: { message: "로그인이 필요합니다." } };

    try {
      const { data: codeData, error: fetchError } = await supabase
        .from('registration_codes')
        .select('*')
        .eq('code', code)
        .single();

      if (fetchError || !codeData) {
        return { error: { message: '유효하지 않은 코드입니다.' } };
      }

      if (codeData.is_used) {
        return { error: { message: '이미 사용된 코드입니다.' } };
      }

      const { error: updateError } = await supabase
        .from('registration_codes')
        .update({
          is_used: true,
          used_by_user_id: user.id,
          used_at: new Date().toISOString(),
        })
        .eq('id', codeData.id);

      if (updateError) return { error: updateError };

      // 권한 업데이트 후 프로필 갱신
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await fetchProfile(session.user);

      return { error: null };

    } catch (err: any) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signInWithGoogle,
        signOut,
        signUp,
        updateProfile,
        updateProfilePicture,
        updatePassword,
        registerCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within Provider");
  return context;
};
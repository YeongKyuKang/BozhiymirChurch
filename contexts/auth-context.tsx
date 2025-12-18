"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "user" | "child";
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
  userProfile: UserProfile | null;
  userRole: "admin" | "user" | "child" | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ data: any; error: any }>;
  signInWithPassword: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, nickname: string, gender: string, code: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<{ data?: any; error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
  verifyRegistrationCode: (code: string) => Promise<{ data?: any; error: any | null }>;
  uploadProfilePicture: (file: File) => Promise<{ error: any; url?: string }>;
  fetchUserProfile: (userId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user" | "child" | null>(null);
  const [loading, setLoading] = useState(true);

  // 날짜 차이 계산 함수 (단위: 일)
  const getDaysSince = (dateString: string | null) => {
    if (!dateString) return 999; // 기록 없으면 통과
    const lastDate = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - lastDate.getTime();
    return diff / (1000 * 60 * 60 * 24);
  };

  const fetchUserProfile = useCallback(async (userId?: string) => {
    const idToFetch = userId || user?.id;
    if (!idToFetch) return;
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", idToFetch).single();
      if (data) {
        setUserProfile(data as UserProfile);
        setUserRole(data.role);
      }
    } catch (error) { console.error(error); }
  }, [user?.id]);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        await fetchUserProfile(initialSession.user.id);
      }
      setLoading(false);
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) await fetchUserProfile(currentSession.user.id);
        else { setUserProfile(null); setUserRole(null); }
        setLoading(false);
      });
      return () => subscription.unsubscribe();
    };
    initializeAuth();
  }, [fetchUserProfile]);

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signIn = async (email: string, password?: string) => {
    if (password) return await signInWithPassword(email, password);
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    return { data, error };
  };

  const signUp = async (email: string, password: string, nickname: string, gender: string, code: string) => {
    const { data: codeData, error: codeError } = await supabase.from('registration_codes').select('*').eq('code', code).eq('is_used', false).single();
    if (codeError || !codeData) return { error: { message: '유효하지 않은 코드입니다.' } };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    if (data.user) {
      await supabase.from("users").update({ nickname, gender, role: codeData.role, can_comment: codeData.role === 'admin' }).eq("id", data.user.id);
      await supabase.from('registration_codes').update({ is_used: true, used_by_user_id: data.user.id, used_at: new Date().toISOString() }).eq('code', code);
    }
    return { error: null };
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !userProfile) return { error: new Error("로그인이 필요합니다.") };
    
    // 한 달(30일) 제한 로직
    if (getDaysSince(userProfile.updated_at) < 30) {
      return { error: { message: `프로필 정보는 한 달에 한 번만 변경 가능합니다. (남은 일수: ${Math.ceil(30 - getDaysSince(userProfile.updated_at))}일)` } };
    }

    const { data, error } = await supabase.from("users").update({ ...profileData, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (!error) await fetchUserProfile(user.id);
    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    if (!user || !userProfile) return { error: new Error("로그인이 필요합니다.") };
    
    // 비밀번호 역시 한 달 제한
    if (getDaysSince(userProfile.updated_at) < 30) {
      return { error: { message: "비밀번호는 한 달에 한 번만 변경 가능합니다." } };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      await supabase.from("users").update({ updated_at: new Date().toISOString() }).eq("id", user.id);
      await fetchUserProfile(user.id);
    }
    return { error };
  };

  const verifyRegistrationCode = async (code: string) => {
    const { data, error } = await supabase.from('registration_codes').select('*').eq('code', code).eq('is_used', false).single();
    if (error || !data) return { error: { message: "유효하지 않거나 이미 사용된 코드입니다." } };
    
    // 코드 검증 성공 시 역할 업데이트
    const { error: upError } = await supabase.from("users").update({ role: data.role }).eq("id", user?.id);
    if (!upError) {
      await supabase.from('registration_codes').update({ is_used: true, used_by_user_id: user?.id, used_at: new Date().toISOString() }).eq('code', code);
      await fetchUserProfile(user?.id);
    }
    return { data, error: upError };
  };

  const uploadProfilePicture = async (file: File) => {
    if (!user) return { error: new Error("로그인이 필요합니다.") };
    const filePath = `${user.id}/${Math.random()}.${file.name.split(".").pop()}`;
    const { error: upError } = await supabase.storage.from("profile-pictures").upload(filePath, file);
    if (upError) return { error: upError };
    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    return await updateUserProfile({ profile_picture_url: data.publicUrl });
  };

  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setUserProfile(null); };

  const value = { user, session, userProfile, userRole, loading, signIn, signInWithPassword, signUp, signOut, updateUserProfile, updatePassword, verifyRegistrationCode, uploadProfilePicture, fetchUserProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
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
  updateUserProfile: (profileData: any) => Promise<any>; // 프로필 업데이트 함수 추가
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

  const updateUserProfile = async (profileData: any) => {
    if (!user) {
      throw new Error("User not logged in.");
    }
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);

    if (error) throw error;
    await fetchUserProfile(user.id); // 프로필 업데이트 후 최신 정보 다시 가져오기
    return data;
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
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { AuthSession, User, Session } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

type SignUpResponseData =
  | { user: User | null; session: Session | null }
  | { user: null; session: null };

interface AuthContextType {
  session: AuthSession | null;
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserProfile['role'] | null | undefined;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    nickname: string,
    gender: 'male' | 'female'
  ) => Promise<{
    data: SignUpResponseData;
    error: Error | null;
  }>;
  updateUserProfile: (
    updates: Partial<UserProfile>,
    profilePictureFile?: File
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // 1. 초기 세션 가져오기 (타임아웃 적용으로 무한 대기 방지)
    const initializeAuth = async () => {
      try {
        // 3초 안에 응답 없으면 강제 종료 (Next.js 15 호환성 이슈 방어)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 3000)
        );

        const result: any = await Promise.race([sessionPromise, timeoutPromise]);
        const initialSession = result.data?.session;

        if (mounted && initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchUserProfile(initialSession.user.id);
        }
      } catch (err: any) {
        console.warn('⚠️ Session init warning:', err.message);
      } finally {
        if (mounted) {
          // 여기서 로딩을 꺼줌
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. 인증 상태 변경 감지 (이것만으로도 로딩 해제 가능하도록 수정)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        // 로그인/세션복구/토큰갱신 시 프로필 로드
        if (['SIGNED_IN', 'TOKEN_REFRESHED', 'INITIAL_SESSION'].includes(event)) {
          await fetchUserProfile(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setSession(null);
        setUser(null);
      }

      // ★ 핵심 수정: 이벤트가 발생했다는 것은 초기화가 되었다는 뜻이므로 로딩 해제
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUserProfile(data);
      }
    } catch (error: any) {
      // 에러가 나도 로딩은 멈추지 않도록 로그만 출력
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    nickname: string,
    gender: 'male' | 'female'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
            gender,
          },
        },
      });

      if (authError) throw authError;
      return { data: authData, error: null };
    } catch (error: any) {
      setError(error.message);
      return {
        data: { user: null, session: null },
        error: error as Error,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (
    updates: Partial<UserProfile>,
    profilePictureFile?: File
  ) => {
    setError(null);
    if (!user) return { error: new Error('No user logged in') };

    try {
      let profile_picture_url = updates.profile_picture_url;

      if (profilePictureFile) {
        const fileExt = profilePictureFile.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, profilePictureFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);

        profile_picture_url = urlData.publicUrl;
      }

      const finalUpdates = { ...updates, profile_picture_url };
      delete (finalUpdates as any).id;
      delete (finalUpdates as any).created_at;
      delete (finalUpdates as any).email;

      const { data, error: updateError } = await supabase
        .from('users')
        .update(finalUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        setUserProfile(data);
      }
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
      return { error };
    }
  };

  const value: AuthContextType = {
    session,
    user,
    userProfile,
    userRole: userProfile?.role,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
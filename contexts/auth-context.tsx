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
import { useRouter } from 'next/navigation';

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
  
  const router = useRouter();

  // 1. 초기화 로직
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 현재 세션 가져오기
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (mounted) {
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            await fetchUserProfile(currentSession.user.id);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        // ★ 핵심: 성공하든 실패하든 로딩은 무조건 끈다.
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 2. 이벤트 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        if (['SIGNED_IN', 'TOKEN_REFRESHED', 'INITIAL_SESSION', 'USER_UPDATED'].includes(event)) {
          await fetchUserProfile(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserProfile(null);
      }
      
      // ★ 이중 안전장치: 이벤트가 발생하면 로딩 종료
      setLoading(false);
    });

    // ★ 3. 최후의 안전장치: 3초가 지나도 로딩 중이면 강제로 끈다.
    // (네트워크가 꼬여서 아무 응답이 없을 때 무한 로딩 방지)
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Force stopping loading spinner');
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) setUserProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoading(false);
    return { error };
  };

const signOut = async () => {
  try {
    // 1. 서버에 로그아웃 알림 (결과 안 기다림)
    supabase.auth.signOut();
    
    // 2. 브라우저 저장소 싹 비우기 (중요!)
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    // 무시
  } finally {
    // 3. React 상태 초기화
    setSession(null);
    setUser(null);
    setUserProfile(null);
    setLoading(false);

    // 4. ★ 핵심: 페이지를 강제로 새로고침하며 이동 (헤더 상태 찌꺼기 제거됨)
    window.location.href = '/'; 
  }
};

  const signUp = async (
    email: string,
    password: string,
    nickname: string,
    gender: 'male' | 'female'
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname, gender },
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: { user: null, session: null }, error };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (
    updates: Partial<UserProfile>,
    profilePictureFile?: File
  ) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      let profile_picture_url = updates.profile_picture_url;

      if (profilePictureFile) {
        const fileExt = profilePictureFile.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('profile-pictures').upload(filePath, profilePictureFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
        profile_picture_url = urlData.publicUrl;
      }

      const finalUpdates = { ...updates, profile_picture_url };
      delete (finalUpdates as any).id;
      delete (finalUpdates as any).created_at;
      delete (finalUpdates as any).email;

      const { data, error } = await supabase.from('users').update(finalUpdates).eq('id', user.id).select().single();
      if (error) throw error;
      if (data) setUserProfile(data);
      return { error: null };
    } catch (error: any) {
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
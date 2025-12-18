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
import { signOutAction } from '@/app/actions/auth'; 

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

  // 프로필 가져오기 (에러가 나도 로딩은 멈추지 않도록 설계)
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setUserProfile(data);
      } else if (error) {
        console.error('Error fetching profile:', error.message);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // ★ 안전 장치: 3초 후 강제 로딩 해제 (무한 로딩 방지)
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn('[AuthContext] Loading timed out (Safety Timer).');
        setLoading(false);
      }
    }, 3000);

    const initializeAuth = async () => {
      try {
        console.log('[Auth] Initializing...');
        
        // ★ 핵심 수정: getUser 대신 getSession 사용 (속도 빠름, 로딩 지연 방지)
        // 클라이언트 사이드에서는 getSession으로 충분합니다.
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (mounted) {
          if (currentSession) {
            console.log('[Auth] Session found:', currentSession.user.id);
            setSession(currentSession);
            setUser(currentSession.user);
            
            // 프로필 가져오기
            await fetchUserProfile(currentSession.user.id);
          } else {
            console.log('[Auth] No session found.');
            setSession(null);
            setUser(null);
            setUserProfile(null);
          }
        }
      } catch (err) {
        console.error('[Auth] Init Error:', err);
      } finally {
        if (mounted) {
          console.log('[Auth] Init finished.');
          setLoading(false); 
          clearTimeout(safetyTimer); // 정상 완료되면 타이머 해제
        }
      }
    };

    initializeAuth();

    // 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[Auth] State Change: ${event}`);
      if (!mounted) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await fetchUserProfile(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        router.refresh();
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
    } else {
      router.refresh();
    }
    return { error };
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // 클라이언트 상태 정리
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      // 서버 액션 호출 (쿠키 삭제 + 리다이렉트)
      await signOutAction();
    } catch (e) {
      console.error(e);
      setLoading(false);
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
        profile_picture_url = `${urlData.publicUrl}?t=${new Date().getTime()}`;
      }

      const finalUpdates = { ...updates, profile_picture_url };
      delete (finalUpdates as any).id;
      delete (finalUpdates as any).created_at;
      delete (finalUpdates as any).email;

      const { data, error } = await supabase.from('users').update(finalUpdates).eq('id', user.id).select().single();
      if (error) throw error;
      if (data) {
        setUserProfile(data);
        router.refresh(); 
      }
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
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { AuthSession, User, Session } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

type SignUpResponseData =
  | { user: User | null; session: Session | null }
  | { user: null; session: null }

interface AuthContextType {
  session: AuthSession | null
  user: User | null
  userProfile: UserProfile | null
  userRole: string | null // ★ userRole 타입 정의 추가
  loading: boolean
  error: string | null
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signUp: (
    email: string,
    password: string,
    nickname: string,
    gender: 'male' | 'female',
  ) => Promise<{
    data: SignUpResponseData
    error: Error | null
  }>
  updateUserProfile: (
    updates: Partial<UserProfile>,
    profilePictureFile?: File,
  ) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ★ userProfile에서 role만 추출하여 관리 (계산된 값)
  const userRole = userProfile?.role ?? null

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
      }

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true)
      setSession(session)
      setUser(session?.user ?? null)

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        await fetchUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null)
      } else if (event === 'USER_UPDATED' && session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error)
      setError(error.message)
      setUserProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setUserProfile(null)
    setLoading(false)
  }

  const signUp = async (
    email: string,
    password: string,
    nickname: string,
    gender: 'male' | 'female',
  ) => {
    setLoading(true)
    setError(null)

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
      })

      if (authError) throw authError

      return { data: authData, error: null }
    } catch (error: any) {
      setError(error.message)
      return {
        data: { user: null, session: null },
        error: error as Error,
      }
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (
    updates: Partial<UserProfile>,
    profilePictureFile?: File,
  ) => {
    setLoading(true)
    setError(null)
    if (!user) {
      setLoading(false)
      return { error: new Error('No user logged in') }
    }

    try {
      let profile_picture_url = updates.profile_picture_url

      if (profilePictureFile) {
        const fileExt = profilePictureFile.name.split('.').pop()
        const fileName = `${user.id}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, profilePictureFile, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath)

        profile_picture_url = urlData.publicUrl
      }

      const finalUpdates = { ...updates, profile_picture_url }
      delete (finalUpdates as any).id
      delete (finalUpdates as any).created_at
      delete (finalUpdates as any).email

      const { data, error: updateError } = await supabase
        .from('users')
        .update(finalUpdates)
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      if (data) setUserProfile(data)
      return { error: null }
    } catch (error: any) {
      setError(error.message)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    session,
    user,
    userProfile,
    userRole, // ★ value 객체에 추가
    loading,
    error,
    signIn,
    signOut,
    signUp,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
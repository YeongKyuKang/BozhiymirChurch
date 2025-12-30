"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

// DB의 User 프로필 타입
interface UserProfile {
  id: string
  email: string
  role: "admin" | "user" | "child" | "guest"
  nickname: string | null
  gender: "male" | "female" | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
  can_comment: boolean
  thanks_posts_today?: number
  last_post_date?: string

  // 변경 제한 기능을 위한 필드
  last_name_change?: string | null
  last_pw_change?: string | null
  last_pic_change?: string | null
}

export interface User extends UserProfile {}

interface AuthContextType {
  user: User | null
  userProfile: User | null // ✅ 추가: user와 동일한 객체를 가리키는 별칭
  userRole: string | undefined // ✅ 추가: 편의를 위한 role 접근자
  loading: boolean
  signIn: (email: string, password?: string) => Promise<{ data: any; error: any }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>

  signUp: (
    email: string,
    password: string,
    nickname: string,
    gender: string,
    profileImage?: File | null,
  ) => Promise<{ error: any | null }>

  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any | null }>
  updateProfilePicture: (file: File) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (error) throw error

      const mergedUser: User = {
        ...data,
        email: authUser.email!,
        id: authUser.id,
      }

      setUser(mergedUser)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (currentSession?.user) {
          await fetchProfile(currentSession.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }

    initializeAuth()
  }, [])

  const signIn = async (email: string, password?: string) => {
    if (password) {
      return await supabase.auth.signInWithPassword({ email, password })
    } else {
      return await supabase.auth.signInWithOtp({ email })
    }
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signUp = async (
    email: string,
    password: string,
    nickname: string,
    gender: string,
    profileImage?: File | null,
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }

    if (data.user) {
      let profilePictureUrl = null

      if (profileImage) {
        try {
          const fileExt = profileImage.name.split(".").pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${data.user.id}/${fileName}`

          const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, profileImage)

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)
            profilePictureUrl = urlData.publicUrl
          }
        } catch (err) {
          console.error("Image upload error:", err)
        }
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          nickname,
          gender,
          profile_picture_url: profilePictureUrl,
        })
        .eq("id", data.user.id)

      if (updateError) return { error: updateError }

      await supabase.auth.signOut()
      setUser(null)
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: { message: "No user logged in" } }

    setUser((prev) => (prev ? { ...prev, ...updates } : null))

    const { error } = await supabase.from("users").update(updates).eq("id", user.id)

    if (error) return { error }
    return { error: null }
  }

  const updateProfilePicture = async (file: File) => {
    if (!user) return { error: { message: "No user logged in" } }

    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file)

    if (uploadError) return { error: uploadError }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_picture_url: publicUrl })
      .eq("id", user.id)

    if (updateError) return { error: updateError }

    setUser((prev) => (prev ? { ...prev, profile_picture_url: publicUrl } : null))

    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile: user, // ✅ 추가됨: user 객체를 userProfile로도 접근 가능하게 함
        userRole: user?.role, // ✅ 추가됨: user.role을 바로 꺼내서 제공
        loading,
        signIn,
        signInWithGoogle,
        signOut,
        signUp,
        updateProfile,
        updateProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error("useAuth must be used within Provider")
  return context
}
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  email: string
  role: "admin" | "user"
  nickname: string | null
  gender: "male" | "female" | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  userRole: "admin" | "user" | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nickname: string, gender: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  uploadProfilePicture: (file: File) => Promise<{ error: any; url?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (data) {
      setUserProfile(data)
      setUserRole(data.role)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, nickname: string, gender: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (!error && data.user) {
      // Update the user profile with nickname and gender
      const { error: profileError } = await supabase
        .from("users")
        .update({
          nickname,
          gender: gender as "male" | "female",
        })
        .eq("id", data.user.id)

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }
    }

    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    const { error } = await supabase.from("users").update(updates).eq("id", user.id)

    if (!error) {
      // Refresh user profile
      await fetchUserProfile(user.id)
    }

    return { error }
  }

  const uploadProfilePicture = async (file: File) => {
    if (!user) return { error: new Error("No user logged in") }

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `profile-pictures/${fileName}`

    const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file)

    if (uploadError) {
      return { error: uploadError }
    }

    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    // Update user profile with new picture URL
    const { error: updateError } = await updateProfile({
      profile_picture_url: publicUrl,
    })

    return { error: updateError, url: publicUrl }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        uploadProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

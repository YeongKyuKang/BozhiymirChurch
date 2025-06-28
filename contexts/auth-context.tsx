"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  email: string
  role: "admin" | "user" | "child"
  nickname: string | null
  gender: "male" | "female" | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
  can_comment: boolean
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  userRole: "admin" | "user" | "child" | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nickname: string, gender: string, code: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  uploadProfilePicture: (file: File) => Promise<{ error: any; url?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userRole, setUserRole] = useState<"admin" | "user" | "child" | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error && error.code === 'PGRST116') { // Profile not found
      console.log("Profile not found in public.users, creating it now.")
      // Create a new user profile with basic info
      const { data: newUserProfile, error: createError } = await supabase
        .from("users")
        .insert({ id: userId, email: user?.email || '', role: 'user', can_comment: false })
        .select()
        .single();
      
      if (createError) {
        console.error("Error creating new user profile:", createError);
      } else {
        setUserProfile(newUserProfile as UserProfile);
        setUserRole(newUserProfile.role);
      }
    } else if (data) {
      setUserProfile(data)
      setUserRole(data.role)
    } else {
      console.error("Error fetching user profile:", error)
    }
  }

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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, nickname: string, gender: string, code: string) => {
    // 1. Validate registration code and get role
    const { data: codeData, error: codeError } = await supabase
        .from('registration_codes')
        .select('*')
        .eq('code', code)
        .eq('is_used', false)
        .single();
    
    if (codeError || !codeData) {
        return { error: { message: 'Invalid or already used registration code.' } };
    }
    
    const assignedRole = codeData.role as "admin" | "user" | "child";
    let canCommentStatus = false;
    if (assignedRole === 'admin') {
        canCommentStatus = true; // Admins are approved for commenting by default
    }
    // Note: Other roles require manual admin approval to set can_comment to true.
    
    // 2. Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
        return { error };
    }

    if (data.user) {
        // 3. Update the user profile with nickname, gender, role, and comment permission
        const { error: profileError } = await supabase
            .from("users")
            .update({
                nickname,
                gender: gender as "male" | "female",
                role: assignedRole,
                can_comment: canCommentStatus // Set initial commenting permission
            })
            .eq("id", data.user.id);

        if (profileError) {
            console.error("Error updating profile:", profileError);
            // Optionally, delete the user if profile update fails to avoid dangling accounts
            await supabase.auth.admin.deleteUser(data.user.id);
            return { error: profileError };
        }
        
        // 4. Mark the registration code as used
        const { error: updateCodeError } = await supabase
            .from('registration_codes')
            .update({ is_used: true, used_by_user_id: data.user.id, used_at: new Date().toISOString() })
            .eq('code', code);
            
        if (updateCodeError) {
            console.error("Error updating registration code:", updateCodeError);
            // This is a non-critical error, but good to log
        }
    }

    return { error: null };
  };

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
    const fileName = `${Math.random()}.${fileExt}`
    // Correct file path to match RLS policy: userId/filename
    const filePath = `${user.id}/${fileName}`

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
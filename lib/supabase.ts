// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

export type Database = {
  public: {
    Tables: {
      content: {
        Row: {
          id: string
          page: string
          section: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page: string
          section: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page?: string
          section?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: "admin" | "user" | "child"
          nickname: string | null
          gender: "male" | "female"| null
          profile_picture_url: string | null
          created_at: string
          updated_at: string
          can_comment: boolean
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "user" | "child"
          nickname?: string | null
          gender?: "male" | "female"| null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "user" | "child"
          nickname?: string | null
          gender?: "male" | "female" | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string | null
          description: string | null
          event_date: string
          start_time: string | null
          end_time: string | null
          location: string | null
          category: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          description?: string | null
          event_date: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          category?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          description?: string | null
          event_date?: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          category?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_forms: { // contact_forms 테이블 정의
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          interests: string[] | Record<string, boolean> | null // Json -> string[] | Record<string, boolean>로 변경
          message: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          interests?: string[] | Record<string, boolean> | null // Json -> string[] | Record<string, boolean>로 변경
          message?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          interests?: string[] | Record<string, boolean> | null // Json -> string[] | Record<string, boolean>로 변경
          message?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Json 타입은 더 이상 interests에 직접 사용되지 않지만, 다른 곳에서 사용될 수 있으므로 유지합니다.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
import { createClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr" // 수정: createBrowserClient를 @supabase/ssr에서 임포트

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient( // 수정: createBrowserClient 사용
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
          role: "admin" | "user"
          nickname: string | null
          gender: "male" | "female"| null
          profile_picture_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "user"
          nickname?: string | null
          gender?: "male" | "female"| null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "user"
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
          date: string
          time: string
          location: string
          description: string
          category: string
          recurring: boolean
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          time: string
          location: string
          description: string
          category: string
          recurring?: boolean
          icon?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          time?: string
          location?: string
          description?: string
          category?: string
          recurring?: boolean
          icon?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "user"
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "user"
          created_at?: string
        }
      }
    }
  }
}

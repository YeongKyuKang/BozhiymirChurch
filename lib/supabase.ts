import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

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
          role: "admin" | "user" | "child" | "guest"
          nickname: string | null
          gender: "male" | "female" | null
          profile_picture_url: string | null
          created_at: string
          updated_at: string
          can_comment: boolean

          last_name_change: string | null
          last_pw_change: string | null
          last_pic_change: string | null
          code_attempts_today: number | null
          last_code_attempt_date: string | null
        }
        Insert: {
          id: string
          email: string
          role?: "admin" | "user" | "child" | "guest"
          nickname?: string | null
          gender?: "male" | "female" | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
          can_comment?: boolean

          last_name_change?: string | null
          last_pw_change?: string | null
          last_pic_change?: string | null
          code_attempts_today?: number | null
          last_code_attempt_date?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: "admin" | "user" | "child" | "guest"
          nickname?: string | null
          gender?: "male" | "female" | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
          can_comment?: boolean

          last_name_change?: string | null
          last_pw_change?: string | null
          last_pic_change?: string | null
          code_attempts_today?: number | null
          last_code_attempt_date?: string | null
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
      contact_forms: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          interests: string[] | Record<string, boolean> | null
          message: string | null
          is_read: boolean
          created_at: string
          age_group: string | null
          receive_updates: boolean
          type: string | null
          subject: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          interests?: string[] | Record<string, boolean> | null
          message?: string | null
          is_read?: boolean
          created_at?: string
          age_group?: string | null
          receive_updates?: boolean
          type?: string | null
          subject?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          interests?: string[] | Record<string, boolean> | null
          message?: string | null
          is_read?: boolean
          created_at?: string
          age_group?: string | null
          receive_updates?: boolean
          type?: string | null
          subject?: string | null
        }
      }
      word_posts: {
        Row: {
          id: string
          title: string
          content: string
          word_date: string
          author_id: string
          author_nickname: string
          created_at: string
          updated_at: string
          image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          word_date: string
          author_id: string
          author_nickname: string
          created_at?: string
          updated_at?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          word_date?: string
          author_id?: string
          author_nickname?: string
          created_at?: string
          updated_at?: string
          image_url?: string | null
        }
      }
      word_reactions: {
        Row: {
          id: string
          user_id: string
          post_id: string
          reaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          reaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          reaction_type?: string
          created_at?: string
        }
      }
      thanks_posts: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          author_id: string
          author_nickname: string
          created_at: string
          updated_at: string
          author_profile_picture_url: string | null
          author_role: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string
          author_id: string
          author_nickname: string
          created_at?: string
          updated_at?: string
          author_profile_picture_url?: string | null
          author_role?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          author_id?: string
          author_nickname?: string
          created_at?: string
          updated_at?: string
          author_profile_picture_url?: string | null
          author_role?: string | null
        }
      }
      thanks_comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          author_nickname: string
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          author_nickname: string
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          author_nickname: string
          comment?: string
          created_at?: string
        }
      }
      thanks_reactions: {
        Row: {
          id: string
          user_id: string
          post_id: string
          reaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          reaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          reaction_type?: string
          created_at?: string
        }
      }
      registration_codes: {
        Row: {
          id: string
          code: string
          role: string
          is_used: boolean
          used_by_user_id: string | null
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          role?: string
          is_used?: boolean
          used_by_user_id?: string | null
          used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          role?: string
          is_used?: boolean
          used_by_user_id?: string | null
          used_at?: string | null
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
  storage: {
    Buckets: {
      "word-backgrounds": {
        Objects: {
          Row: {
            bucket_id: string
            created_at: string
            id: string
            last_accessed_at: string
            name: string
            owner: string | null
            path_tokens: string[]
            updated_at: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            id?: string
            last_accessed_at?: string
            name: string
            owner?: string | null
            path_tokens?: string[]
            updated_at?: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            id?: string
            last_accessed_at?: string
            name?: string
            owner?: string | null
            path_tokens?: string[]
            updated_at?: string
          }
        }
      }
      "profile-pictures": {
        Objects: {
          Row: {
            bucket_id: string
            created_at: string
            id: string
            last_accessed_at: string
            name: string
            owner: string | null
            path_tokens: string[]
            updated_at: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            id?: string
            last_accessed_at?: string
            name: string
            owner?: string | null
            path_tokens?: string[]
            updated_at?: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            id?: string
            last_accessed_at?: string
            name?: string
            owner?: string | null
            path_tokens?: string[]
            updated_at?: string
          }
        }
      }
      "event-banners": {
        Objects: {
          Row: {
            bucket_id: string
            created_at: string
            id: string
            last_accessed_at: string
            name: string
            owner: string | null
            path_tokens: string[]
            updated_at: string
          }
          Insert: {
            bucket_id: string
            created_at?: string
            id?: string
            last_accessed_at?: string
            name: string
            owner?: string | null
            path_tokens?: string[]
            updated_at?: string
          }
          Update: {
            bucket_id?: string
            created_at?: string
            id?: string
            last_accessed_at?: string
            name?: string
            owner?: string | null
            path_tokens?: string[]
            updated_at?: string
          }
        }
      }
    }
  }
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

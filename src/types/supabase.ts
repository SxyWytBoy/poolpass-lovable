
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pools: {
        Row: {
          id: string
          name: string
          description: string
          location: string
          price: number
          rating: number
          reviews: number
          indoor_outdoor: 'indoor' | 'outdoor' | 'both'
          images: string[]
          amenities: Json
          extras: Json
          pool_details: Json
          host_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          location: string
          price: number
          rating?: number
          reviews?: number
          indoor_outdoor: 'indoor' | 'outdoor' | 'both'
          images: string[]
          amenities: Json
          extras: Json
          pool_details: Json
          host_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location?: string
          price?: number
          rating?: number
          reviews?: number
          indoor_outdoor?: 'indoor' | 'outdoor' | 'both'
          images?: string[]
          amenities?: Json
          extras?: Json
          pool_details?: Json
          host_id?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          pool_id: string
          user_id: string
          date: string
          time_slot: string
          extras: string[]
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          pool_id: string
          user_id: string
          date: string
          time_slot: string
          extras: string[]
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          pool_id?: string
          user_id?: string
          date?: string
          time_slot?: string
          extras?: string[]
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          pool_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pool_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pool_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          user_type: 'guest' | 'host' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: 'guest' | 'host' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: 'guest' | 'host' | 'admin'
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
  }
}

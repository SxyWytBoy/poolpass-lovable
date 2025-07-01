export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      availability_calendar: {
        Row: {
          created_at: string | null
          custom_price: number | null
          date: string
          id: string
          is_available: boolean | null
          notes: string | null
          pool_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_price?: number | null
          date: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          pool_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_price?: number | null
          date?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          pool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_calendar_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_sync_logs: {
        Row: {
          crm_integration_id: string
          error_details: Json | null
          id: string
          message: string | null
          pool_id: string | null
          status: Database["public"]["Enums"]["sync_status"]
          sync_completed_at: string | null
          sync_started_at: string
          sync_type: Database["public"]["Enums"]["sync_type"]
          synced_data: Json | null
        }
        Insert: {
          crm_integration_id: string
          error_details?: Json | null
          id?: string
          message?: string | null
          pool_id?: string | null
          status: Database["public"]["Enums"]["sync_status"]
          sync_completed_at?: string | null
          sync_started_at?: string
          sync_type: Database["public"]["Enums"]["sync_type"]
          synced_data?: Json | null
        }
        Update: {
          crm_integration_id?: string
          error_details?: Json | null
          id?: string
          message?: string | null
          pool_id?: string | null
          status?: Database["public"]["Enums"]["sync_status"]
          sync_completed_at?: string | null
          sync_started_at?: string
          sync_type?: Database["public"]["Enums"]["sync_type"]
          synced_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_sync_logs_crm_integration_id_fkey"
            columns: ["crm_integration_id"]
            isOneToOne: false
            referencedRelation: "crm_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_sync_logs_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_modifications: {
        Row: {
          booking_id: string | null
          fee_amount: number | null
          id: string
          modification_type: string
          new_value: Json | null
          original_value: Json | null
          processed_at: string | null
          requested_at: string | null
          requested_by: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          fee_amount?: number | null
          id?: string
          modification_type: string
          new_value?: Json | null
          original_value?: Json | null
          processed_at?: string | null
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          fee_amount?: number | null
          id?: string
          modification_type?: string
          new_value?: Json | null
          original_value?: Json | null
          processed_at?: string | null
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_modifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          cancellation_policy: string | null
          created_at: string
          end_time: string
          guests: number
          id: string
          modification_deadline: string | null
          pool_id: string
          security_deposit_amount: number | null
          special_requests: string | null
          start_time: string
          status: string | null
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          cancellation_policy?: string | null
          created_at?: string
          end_time: string
          guests?: number
          id?: string
          modification_deadline?: string | null
          pool_id: string
          security_deposit_amount?: number | null
          special_requests?: string | null
          start_time: string
          status?: string | null
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          cancellation_policy?: string | null
          created_at?: string
          end_time?: string
          guests?: number
          id?: string
          modification_deadline?: string | null
          pool_id?: string
          security_deposit_amount?: number | null
          special_requests?: string | null
          start_time?: string
          status?: string | null
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_credentials: {
        Row: {
          created_at: string
          credential_type: string
          crm_integration_id: string
          encrypted_value: string
          expires_at: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_type: string
          crm_integration_id: string
          encrypted_value: string
          expires_at?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_type?: string
          crm_integration_id?: string
          encrypted_value?: string
          expires_at?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_credentials_crm_integration_id_fkey"
            columns: ["crm_integration_id"]
            isOneToOne: false
            referencedRelation: "crm_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_integrations: {
        Row: {
          configuration: Json | null
          created_at: string
          host_id: string
          id: string
          integration_name: string
          is_active: boolean
          last_sync_at: string | null
          provider: Database["public"]["Enums"]["crm_provider"]
          sync_frequency_hours: number | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          host_id: string
          id?: string
          integration_name: string
          is_active?: boolean
          last_sync_at?: string | null
          provider: Database["public"]["Enums"]["crm_provider"]
          sync_frequency_hours?: number | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          host_id?: string
          id?: string
          integration_name?: string
          is_active?: boolean
          last_sync_at?: string | null
          provider?: Database["public"]["Enums"]["crm_provider"]
          sync_frequency_hours?: number | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_integrations_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pool_mappings: {
        Row: {
          created_at: string
          crm_integration_id: string
          external_pool_id: string
          external_pool_name: string | null
          id: string
          is_active: boolean
          mapping_configuration: Json | null
          poolpass_pool_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crm_integration_id: string
          external_pool_id: string
          external_pool_name?: string | null
          id?: string
          is_active?: boolean
          mapping_configuration?: Json | null
          poolpass_pool_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crm_integration_id?: string
          external_pool_id?: string
          external_pool_name?: string | null
          id?: string
          is_active?: boolean
          mapping_configuration?: Json | null
          poolpass_pool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_pool_mappings_crm_integration_id_fkey"
            columns: ["crm_integration_id"]
            isOneToOne: false
            referencedRelation: "crm_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_pool_mappings_poolpass_pool_id_fkey"
            columns: ["poolpass_pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      document_uploads: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          uploaded_at: string | null
          verification_id: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          uploaded_at?: string | null
          verification_id?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          uploaded_at?: string | null
          verification_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_uploads_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "identity_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          pool_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pool_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pool_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          likely_to_book: string | null
          location: string
          name: string
          swimming_frequency: string
          use_for: string[]
          use_for_other: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          likely_to_book?: string | null
          location: string
          name: string
          swimming_frequency: string
          use_for: string[]
          use_for_other?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          likely_to_book?: string | null
          location?: string
          name?: string
          swimming_frequency?: string
          use_for?: string[]
          use_for_other?: string | null
        }
        Relationships: []
      }
      host_waitlist: {
        Row: {
          additional_info: string | null
          business_name: string
          contact_name: string
          created_at: string
          current_use: string[]
          email: string
          id: string
          interest_level: string[]
          location: string
          pool_type: string[]
        }
        Insert: {
          additional_info?: string | null
          business_name: string
          contact_name: string
          created_at?: string
          current_use: string[]
          email: string
          id?: string
          interest_level: string[]
          location: string
          pool_type: string[]
        }
        Update: {
          additional_info?: string | null
          business_name?: string
          contact_name?: string
          created_at?: string
          current_use?: string[]
          email?: string
          id?: string
          interest_level?: string[]
          location?: string
          pool_type?: string[]
        }
        Relationships: []
      }
      identity_verifications: {
        Row: {
          created_at: string | null
          document_number: string | null
          document_type: string | null
          expires_at: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          user_id: string | null
          verification_type: string
        }
        Insert: {
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          user_id?: string | null
          verification_type: string
        }
        Update: {
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          user_id?: string | null
          verification_type?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          booking_id: string | null
          description: string
          id: string
          incident_type: string
          reported_at: string | null
          reporter_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          description: string
          id?: string
          incident_type: string
          reported_at?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          description?: string
          id?: string
          incident_type?: string
          reported_at?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          coverage_amount: number | null
          coverage_type: string | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          policy_number: string
          pool_id: string | null
          provider: string
          start_date: string
        }
        Insert: {
          coverage_amount?: number | null
          coverage_type?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          policy_number: string
          pool_id?: string | null
          provider: string
          start_date: string
        }
        Update: {
          coverage_amount?: number | null
          coverage_type?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          policy_number?: string
          pool_id?: string | null
          provider?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_text: string
          message_type: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          booking_id?: string | null
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text: string
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          booking_id?: string | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text?: string
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          last_four: string | null
          stripe_payment_method_id: string
          type: string
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          stripe_payment_method_id: string
          type: string
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          stripe_payment_method_id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pool_amenities: {
        Row: {
          amenity_id: string
          id: string
          pool_id: string
        }
        Insert: {
          amenity_id: string
          id?: string
          pool_id: string
        }
        Update: {
          amenity_id?: string
          id?: string
          pool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pool_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pool_amenities_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      pools: {
        Row: {
          amenities: Json | null
          available_time_slots: Json | null
          cancellation_policy: string | null
          check_in_instructions: string | null
          created_at: string
          description: string | null
          extras: Json | null
          host_id: string
          house_rules: string | null
          id: string
          images: string[] | null
          instant_book: boolean | null
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          pool_details: Json | null
          price_per_hour: number
          rating: number | null
          reviews_count: number | null
          safety_features: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          available_time_slots?: Json | null
          cancellation_policy?: string | null
          check_in_instructions?: string | null
          created_at?: string
          description?: string | null
          extras?: Json | null
          host_id: string
          house_rules?: string | null
          id?: string
          images?: string[] | null
          instant_book?: boolean | null
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          pool_details?: Json | null
          price_per_hour: number
          rating?: number | null
          reviews_count?: number | null
          safety_features?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          available_time_slots?: Json | null
          cancellation_policy?: string | null
          check_in_instructions?: string | null
          created_at?: string
          description?: string | null
          extras?: Json | null
          host_id?: string
          house_rules?: string | null
          id?: string
          images?: string[] | null
          instant_book?: boolean | null
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          pool_details?: Json | null
          price_per_hour?: number
          rating?: number | null
          reviews_count?: number | null
          safety_features?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pools_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          modifier_type: string | null
          pool_id: string | null
          price_modifier: number
          rule_type: string
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          modifier_type?: string | null
          pool_id?: string | null
          price_modifier: number
          rule_type: string
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          modifier_type?: string | null
          pool_id?: string | null
          price_modifier?: number
          rule_type?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          emergency_contact: Json | null
          full_name: string | null
          id: string
          is_guest_verified: boolean | null
          is_host_verified: boolean | null
          phone: string | null
          preferred_language: string | null
          user_type: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          full_name?: string | null
          id: string
          is_guest_verified?: boolean | null
          is_host_verified?: boolean | null
          phone?: string | null
          preferred_language?: string | null
          user_type?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          full_name?: string | null
          id?: string
          is_guest_verified?: boolean | null
          is_host_verified?: boolean | null
          phone?: string | null
          preferred_language?: string | null
          user_type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          processed_at: string | null
          reason: string | null
          status: string | null
          stripe_refund_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          processed_at?: string | null
          reason?: string | null
          status?: string | null
          stripe_refund_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          processed_at?: string | null
          reason?: string | null
          status?: string | null
          stripe_refund_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          pool_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          pool_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          pool_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          search_criteria: Json
          search_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          search_criteria: Json
          search_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          search_criteria?: Json
          search_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_deposits: {
        Row: {
          amount: number
          authorized_at: string | null
          booking_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          released_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          authorized_at?: string | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          released_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          authorized_at?: string | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          released_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_deposits_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_host_crm_integrations: {
        Args: { host_uuid: string }
        Returns: {
          integration_id: string
          provider: Database["public"]["Enums"]["crm_provider"]
          integration_name: string
          is_active: boolean
          last_sync_at: string
          sync_frequency_hours: number
        }[]
      }
      get_integrations_due_for_sync: {
        Args: Record<PropertyKey, never>
        Returns: {
          integration_id: string
          host_id: string
          provider: Database["public"]["Enums"]["crm_provider"]
          integration_name: string
          last_sync_at: string
          sync_frequency_hours: number
        }[]
      }
      update_integration_last_sync: {
        Args: { integration_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      crm_provider: "mews" | "cloudbeds" | "opera" | "protel" | "custom"
      sync_status: "success" | "error" | "in_progress" | "pending"
      sync_type: "availability" | "pools" | "bookings" | "pricing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      crm_provider: ["mews", "cloudbeds", "opera", "protel", "custom"],
      sync_status: ["success", "error", "in_progress", "pending"],
      sync_type: ["availability", "pools", "bookings", "pricing"],
    },
  },
} as const

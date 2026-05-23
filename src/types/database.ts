export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agency_profiles: {
        Row: {
          agency_name: string
          contact_name: string | null
          contact_position: string | null
          contract_types: string[] | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          languages: string[] | null
          logo_url: string | null
          phone: string | null
          profile_id: string
          rec_license: boolean | null
          regions: string[] | null
          registration_number: string | null
          specializations: string[] | null
          website: string | null
        }
        Insert: {
          agency_name: string
          contact_name?: string | null
          contact_position?: string | null
          contract_types?: string[] | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          phone?: string | null
          profile_id: string
          rec_license?: boolean | null
          regions?: string[] | null
          registration_number?: string | null
          specializations?: string[] | null
          website?: string | null
        }
        Update: {
          agency_name?: string
          contact_name?: string | null
          contact_position?: string | null
          contract_types?: string[] | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          phone?: string | null
          profile_id?: string
          rec_license?: boolean | null
          regions?: string[] | null
          registration_number?: string | null
          specializations?: string[] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          city: string | null
          company_name: string
          company_size: string | null
          company_type: string | null
          contact_name: string | null
          contact_position: string | null
          created_at: string | null
          description: string | null
          email: string | null
          founded_year: number | null
          id: string
          languages: string[] | null
          logo_url: string | null
          messengers: Json | null
          phone: string | null
          portfolio_photos: string[] | null
          postcode: string | null
          profile_id: string
          regions: string[] | null
          specializations: string[] | null
          website: string | null
        }
        Insert: {
          city?: string | null
          company_name: string
          company_size?: string | null
          company_type?: string | null
          contact_name?: string | null
          contact_position?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          messengers?: Json | null
          phone?: string | null
          portfolio_photos?: string[] | null
          postcode?: string | null
          profile_id: string
          regions?: string[] | null
          specializations?: string[] | null
          website?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string
          company_size?: string | null
          company_type?: string | null
          contact_name?: string | null
          contact_position?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          messengers?: Json | null
          phone?: string | null
          portfolio_photos?: string[] | null
          postcode?: string | null
          profile_id?: string
          regions?: string[] | null
          specializations?: string[] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          author_id: string
          breaks_minutes: number | null
          contact_email: string | null
          contact_lang: string[] | null
          contact_name: string
          contact_phone: string | null
          country: string | null
          created_at: string | null
          days_per_week: number | null
          employer_name: string | null
          employer_type: string | null
          expires_at: string | null
          extra_notes: string | null
          hours_onsite: number | null
          hours_paid: number | null
          id: string
          location_area: string
          location_postcode: string | null
          messengers: string[] | null
          overtime_hours: number | null
          overtime_rate: string | null
          pay_period: string | null
          pay_rate: number | null
          pay_type: string | null
          payment_method: string | null
          ppe_provided: string[] | null
          profession: string
          project_duration: string | null
          required_docs: string[] | null
          site_language: string | null
          start_date: string | null
          status: string | null
          tools_provided: boolean | null
          views_count: number | null
          weekend_rate: string | null
          workers_count: number | null
        }
        Insert: {
          author_id: string
          breaks_minutes?: number | null
          contact_email?: string | null
          contact_lang?: string[] | null
          contact_name: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          days_per_week?: number | null
          employer_name?: string | null
          employer_type?: string | null
          expires_at?: string | null
          extra_notes?: string | null
          hours_onsite?: number | null
          hours_paid?: number | null
          id?: string
          location_area: string
          location_postcode?: string | null
          messengers?: string[] | null
          overtime_hours?: number | null
          overtime_rate?: string | null
          pay_period?: string | null
          pay_rate?: number | null
          pay_type?: string | null
          payment_method?: string | null
          ppe_provided?: string[] | null
          profession: string
          project_duration?: string | null
          required_docs?: string[] | null
          site_language?: string | null
          start_date?: string | null
          status?: string | null
          tools_provided?: boolean | null
          views_count?: number | null
          weekend_rate?: string | null
          workers_count?: number | null
        }
        Update: {
          author_id?: string
          breaks_minutes?: number | null
          contact_email?: string | null
          contact_lang?: string[] | null
          contact_name?: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          days_per_week?: number | null
          employer_name?: string | null
          employer_type?: string | null
          expires_at?: string | null
          extra_notes?: string | null
          hours_onsite?: number | null
          hours_paid?: number | null
          id?: string
          location_area?: string
          location_postcode?: string | null
          messengers?: string[] | null
          overtime_hours?: number | null
          overtime_rate?: string | null
          pay_period?: string | null
          pay_rate?: number | null
          pay_type?: string | null
          payment_method?: string | null
          ppe_provided?: string[] | null
          profession?: string
          project_duration?: string | null
          required_docs?: string[] | null
          site_language?: string | null
          start_date?: string | null
          status?: string | null
          tools_provided?: boolean | null
          views_count?: number | null
          weekend_rate?: string | null
          workers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          payload: Json | null
          read_at: string | null
          recipient_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payload?: Json | null
          read_at?: string | null
          recipient_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payload?: Json | null
          read_at?: string | null
          recipient_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_photos: {
        Row: {
          caption: string | null
          id: string
          storage_path: string
          uploaded_at: string | null
          worker_profile_id: string | null
        }
        Insert: {
          caption?: string | null
          id?: string
          storage_path: string
          uploaded_at?: string | null
          worker_profile_id?: string | null
        }
        Update: {
          caption?: string | null
          id?: string
          storage_path?: string
          uploaded_at?: string | null
          worker_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_photos_worker_profile_id_fkey"
            columns: ["worker_profile_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_profiles: {
        Row: {
          city: string | null
          created_at: string | null
          display_name: string
          id: string
          phone: string | null
          profile_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          phone?: string | null
          profile_id: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          phone?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          lang: string | null
          onboarding_complete: boolean | null
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          lang?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          role: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          lang?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      saved_listings: {
        Row: {
          id: string
          listing_id: string | null
          profile_id: string | null
          saved_at: string | null
        }
        Insert: {
          id?: string
          listing_id?: string | null
          profile_id?: string | null
          saved_at?: string | null
        }
        Update: {
          id?: string
          listing_id?: string | null
          profile_id?: string | null
          saved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_listings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      short_work_listings: {
        Row: {
          address: string | null
          budget_amount: number | null
          budget_type: string | null
          city: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          payment_method: string | null
          photos: string[] | null
          postcode: string | null
          preferred_date: string | null
          preferred_time: string | null
          profile_id: string
          service_type: string
          status: string | null
          title: string
          urgency: string | null
          views_count: number | null
        }
        Insert: {
          address?: string | null
          budget_amount?: number | null
          budget_type?: string | null
          city?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          photos?: string[] | null
          postcode?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          profile_id: string
          service_type: string
          status?: string | null
          title: string
          urgency?: string | null
          views_count?: number | null
        }
        Update: {
          address?: string | null
          budget_amount?: number | null
          budget_type?: string | null
          city?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          photos?: string[] | null
          postcode?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          profile_id?: string
          service_type?: string
          status?: string | null
          title?: string
          urgency?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "short_work_listings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_profiles: {
        Row: {
          additional_professions: string[] | null
          bio: string | null
          certifications: string[] | null
          completion_rate: number | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          cscs_level: string | null
          cscs_status: boolean | null
          dbs: boolean | null
          display_name: string
          expected_rate: number | null
          experience: string | null
          founded_year: number | null
          has_tools: boolean | null
          id: string
          languages: string[] | null
          logo_url: string | null
          messengers: string[] | null
          messengers_json: Json | null
          nino: string | null
          payment_methods: string[] | null
          portfolio_photos_urls: string[] | null
          profession: string | null
          profile_id: string
          rate_type: string | null
          ready_to_travel: boolean | null
          right_to_work: string | null
          specializations: string[] | null
          team_size: string | null
          team_type: string | null
          type: string | null
          utr: string | null
          website: string | null
          work_areas: string[] | null
          work_cities: string[] | null
          works_piecework: boolean | null
          works_remotely: boolean | null
        }
        Insert: {
          additional_professions?: string[] | null
          bio?: string | null
          certifications?: string[] | null
          completion_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          cscs_level?: string | null
          cscs_status?: boolean | null
          dbs?: boolean | null
          display_name: string
          expected_rate?: number | null
          experience?: string | null
          founded_year?: number | null
          has_tools?: boolean | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          messengers?: string[] | null
          messengers_json?: Json | null
          nino?: string | null
          payment_methods?: string[] | null
          portfolio_photos_urls?: string[] | null
          profession?: string | null
          profile_id: string
          rate_type?: string | null
          ready_to_travel?: boolean | null
          right_to_work?: string | null
          specializations?: string[] | null
          team_size?: string | null
          team_type?: string | null
          type?: string | null
          utr?: string | null
          website?: string | null
          work_areas?: string[] | null
          work_cities?: string[] | null
          works_piecework?: boolean | null
          works_remotely?: boolean | null
        }
        Update: {
          additional_professions?: string[] | null
          bio?: string | null
          certifications?: string[] | null
          completion_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          cscs_level?: string | null
          cscs_status?: boolean | null
          dbs?: boolean | null
          display_name?: string
          expected_rate?: number | null
          experience?: string | null
          founded_year?: number | null
          has_tools?: boolean | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          messengers?: string[] | null
          messengers_json?: Json | null
          nino?: string | null
          payment_methods?: string[] | null
          portfolio_photos_urls?: string[] | null
          profession?: string | null
          profile_id?: string
          rate_type?: string | null
          ready_to_travel?: boolean | null
          right_to_work?: string | null
          specializations?: string[] | null
          team_size?: string | null
          team_type?: string | null
          type?: string | null
          utr?: string | null
          website?: string | null
          work_areas?: string[] | null
          work_cities?: string[] | null
          works_piecework?: boolean | null
          works_remotely?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_views: { Args: { row_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

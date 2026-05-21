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
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          lang: string | null
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
      worker_profiles: {
        Row: {
          bio: string | null
          certifications: string[] | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          display_name: string
          founded_year: number | null
          id: string
          languages: string[] | null
          logo_url: string | null
          messengers: string[] | null
          payment_methods: string[] | null
          profile_id: string
          specializations: string[] | null
          team_size: string | null
          type: string | null
          website: string | null
          work_areas: string[] | null
          works_piecework: boolean | null
          works_remotely: boolean | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          display_name: string
          founded_year?: number | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          messengers?: string[] | null
          payment_methods?: string[] | null
          profile_id: string
          specializations?: string[] | null
          team_size?: string | null
          type?: string | null
          website?: string | null
          work_areas?: string[] | null
          works_piecework?: boolean | null
          works_remotely?: boolean | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string
          founded_year?: number | null
          id?: string
          languages?: string[] | null
          logo_url?: string | null
          messengers?: string[] | null
          payment_methods?: string[] | null
          profile_id?: string
          specializations?: string[] | null
          team_size?: string | null
          type?: string | null
          website?: string | null
          work_areas?: string[] | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          enquiry_type: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          enquiry_type: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          enquiry_type?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      media_items: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          featured: boolean
          id: string
          media_type: string
          poster_url: string | null
          sort_order: number
          storage_path: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          media_type: string
          poster_url?: string | null
          sort_order?: number
          storage_path?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          media_type?: string
          poster_url?: string | null
          sort_order?: number
          storage_path?: string | null
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement_body: string | null
          announcement_title: string | null
          contact_email: string | null
          event_date: string | null
          event_name: string | null
          event_published: boolean
          event_time: string | null
          event_venue: string | null
          id: number
          instagram_url: string
          market_status: string
          newsletter_note: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          announcement_body?: string | null
          announcement_title?: string | null
          contact_email?: string | null
          event_date?: string | null
          event_name?: string | null
          event_published?: boolean
          event_time?: string | null
          event_venue?: string | null
          id?: number
          instagram_url?: string
          market_status?: string
          newsletter_note?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          announcement_body?: string | null
          announcement_title?: string | null
          contact_email?: string | null
          event_date?: string | null
          event_name?: string | null
          event_published?: boolean
          event_time?: string | null
          event_venue?: string | null
          id?: number
          instagram_url?: string
          market_status?: string
          newsletter_note?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          additional_info: string | null
          agreed_terms: boolean
          business_name: string
          categories: string[]
          city: string
          contact_person: string
          created_at: string
          description: string
          document_paths: string[]
          email: string
          equipment: string | null
          id: string
          instagram: string
          internal_notes: string | null
          logo_path: string | null
          motivation: string
          needs_electricity: boolean
          needs_water: boolean
          other_category: string | null
          participated_before: boolean
          phone: string
          product_paths: string[]
          reference: string
          space_type: string
          special_requirements: string | null
          special_setup: string | null
          stall_size: string | null
          status: Database["public"]["Enums"]["application_status"]
          uniqueness: string
          updated_at: string
          website: string | null
        }
        Insert: {
          additional_info?: string | null
          agreed_terms?: boolean
          business_name: string
          categories?: string[]
          city: string
          contact_person: string
          created_at?: string
          description: string
          document_paths?: string[]
          email: string
          equipment?: string | null
          id?: string
          instagram: string
          internal_notes?: string | null
          logo_path?: string | null
          motivation: string
          needs_electricity?: boolean
          needs_water?: boolean
          other_category?: string | null
          participated_before?: boolean
          phone: string
          product_paths?: string[]
          reference?: string
          space_type: string
          special_requirements?: string | null
          special_setup?: string | null
          stall_size?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          uniqueness: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          additional_info?: string | null
          agreed_terms?: boolean
          business_name?: string
          categories?: string[]
          city?: string
          contact_person?: string
          created_at?: string
          description?: string
          document_paths?: string[]
          email?: string
          equipment?: string | null
          id?: string
          instagram?: string
          internal_notes?: string | null
          logo_path?: string | null
          motivation?: string
          needs_electricity?: boolean
          needs_water?: boolean
          other_category?: string | null
          participated_before?: boolean
          phone?: string
          product_paths?: string[]
          reference?: string
          space_type?: string
          special_requirements?: string | null
          special_setup?: string | null
          stall_size?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          uniqueness?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      vendor_spotlights: {
        Row: {
          brand_name: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          instagram: string | null
          logo_url: string | null
          published: boolean
          sort_order: number
        }
        Insert: {
          brand_name: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          logo_url?: string | null
          published?: boolean
          sort_order?: number
        }
        Update: {
          brand_name?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          logo_url?: string | null
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      application_status:
        | "received"
        | "under_review"
        | "approved"
        | "waitlisted"
        | "declined"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      application_status: [
        "received",
        "under_review",
        "approved",
        "waitlisted",
        "declined",
      ],
    },
  },
} as const

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
      campaign_emails: {
        Row: {
          campaign_id: string
          emails_failed: number
          emails_sent: number
          id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          emails_failed?: number
          emails_sent?: number
          id?: string
          sent_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          emails_failed?: number
          emails_sent?: number
          id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_emails_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      link_analytics: {
        Row: {
          created_at: string
          device_type: string
          id: string
          is_qr_scan: boolean
          link_id: string
          location_city: string | null
          location_country: string | null
          referrer: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type: string
          id?: string
          is_qr_scan?: boolean
          link_id: string
          location_city?: string | null
          location_country?: string | null
          referrer?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string
          id?: string
          is_qr_scan?: boolean
          link_id?: string
          location_city?: string | null
          location_country?: string | null
          referrer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_analytics_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          campaign_id: string | null
          clicks: number
          created_at: string
          custom_backhalf: string | null
          id: string
          original_url: string
          qr_code_design_id: string | null
          short_url: string
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number
          created_at?: string
          custom_backhalf?: string | null
          id?: string
          original_url: string
          qr_code_design_id?: string | null
          short_url: string
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicks?: number
          created_at?: string
          custom_backhalf?: string | null
          id?: string
          original_url?: string
          qr_code_design_id?: string | null
          short_url?: string
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_qr_code_design_id_fkey"
            columns: ["qr_code_design_id"]
            isOneToOne: false
            referencedRelation: "qr_code_designs"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_designs: {
        Row: {
          background_color: string
          center_icon: string | null
          corner_color: string | null
          corner_style: string
          created_at: string
          custom_text: string | null
          foreground_color: string
          frame_style: string | null
          id: string
          logo_url: string | null
          name: string
          pattern: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background_color?: string
          center_icon?: string | null
          corner_color?: string | null
          corner_style?: string
          created_at?: string
          custom_text?: string | null
          foreground_color?: string
          frame_style?: string | null
          id?: string
          logo_url?: string | null
          name: string
          pattern?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background_color?: string
          center_icon?: string | null
          corner_color?: string | null
          corner_style?: string
          created_at?: string
          custom_text?: string | null
          foreground_color?: string
          frame_style?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          pattern?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage: {
        Row: {
          created_at: string
          custom_backhalves_used: number
          id: string
          last_reset: string
          links_used: number
          qr_codes_used: number
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_backhalves_used?: number
          id?: string
          last_reset?: string
          links_used?: number
          qr_codes_used?: number
          user_id: string
        }
        Update: {
          created_at?: string
          custom_backhalves_used?: number
          id?: string
          last_reset?: string
          links_used?: number
          qr_codes_used?: number
          user_id?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

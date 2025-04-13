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
      artists: {
        Row: {
          created_at: string | null
          description: string | null
          facebook_url: string | null
          follower_count: number | null
          id: string
          instagram_url: string | null
          last_name: string | null
          name: string
          profile_image: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          follower_count?: number | null
          id: string
          instagram_url?: string | null
          last_name?: string | null
          name: string
          profile_image?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          facebook_url?: string | null
          follower_count?: number | null
          id?: string
          instagram_url?: string | null
          last_name?: string | null
          name?: string
          profile_image?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string
          artist_id: string
          city: string
          created_at: string | null
          cross_streets: string
          date: string
          description: string
          id: string
          image_url: string
          latitude: number
          locality: string
          longitude: number
          ticket_url: string | null
          title: string
          type: string
          video_url: string | null
        }
        Insert: {
          address: string
          artist_id: string
          city: string
          created_at?: string | null
          cross_streets: string
          date: string
          description: string
          id?: string
          image_url: string
          latitude: number
          locality: string
          longitude: number
          ticket_url?: string | null
          title: string
          type: string
          video_url?: string | null
        }
        Update: {
          address?: string
          artist_id?: string
          city?: string
          created_at?: string | null
          cross_streets?: string
          date?: string
          description?: string
          id?: string
          image_url?: string
          latitude?: number
          locality?: string
          longitude?: number
          ticket_url?: string | null
          title?: string
          type?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      fans: {
        Row: {
          created_at: string | null
          id: string
          last_name: string | null
          name: string
          profile_image: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          last_name?: string | null
          name: string
          profile_image?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_name?: string | null
          name?: string
          profile_image?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          artist_id: string
          created_at: string | null
          fan_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          fan_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          fan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
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
    Enums: {},
  },
} as const

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
      app_settings: {
        Row: {
          break_time: number
          compact_mode: boolean
          created_at: string
          default_focus_time: number
          font_size: string
          id: string
          notifications: boolean
          sound: boolean
          theme: string
          updated_at: string
        }
        Insert: {
          break_time?: number
          compact_mode?: boolean
          created_at?: string
          default_focus_time?: number
          font_size?: string
          id?: string
          notifications?: boolean
          sound?: boolean
          theme?: string
          updated_at?: string
        }
        Update: {
          break_time?: number
          compact_mode?: boolean
          created_at?: string
          default_focus_time?: number
          font_size?: string
          id?: string
          notifications?: boolean
          sound?: boolean
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_tasks: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          priority: number
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          id?: string
          priority?: number
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          priority?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_reflections: {
        Row: {
          created_at: string
          date: string
          id: string
          improvements: string | null
          updated_at: string
          wins: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          improvements?: string | null
          updated_at?: string
          wins?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          improvements?: string | null
          updated_at?: string
          wins?: string | null
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          priority: number
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          priority?: number
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          priority?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_tracking: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          date: string
          id: string
          prayer_name: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          prayer_name: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          prayer_name?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          focus_sessions: number
          id: string
          level: number
          streak: number
          tasks_completed: number
          updated_at: string
          xp: number
          xp_for_next_level: number
        }
        Insert: {
          created_at?: string
          focus_sessions?: number
          id?: string
          level?: number
          streak?: number
          tasks_completed?: number
          updated_at?: string
          xp?: number
          xp_for_next_level?: number
        }
        Update: {
          created_at?: string
          focus_sessions?: number
          id?: string
          level?: number
          streak?: number
          tasks_completed?: number
          updated_at?: string
          xp?: number
          xp_for_next_level?: number
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

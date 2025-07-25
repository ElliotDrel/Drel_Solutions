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
      // User profiles table for storing user information
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      
      // Extensible survey types table for future survey types
      survey_types: {
        Row: {
          id: string
          name: string // 'ai-fundamentals', 'advanced-prompting', etc.
          version: number
          schema_definition: Json // Flexible schema for different survey types
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          version?: number
          schema_definition: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          version?: number
          schema_definition?: Json
          created_at?: string
        }
        Relationships: []
      }
      
      // Survey responses with phase tracking
      survey_responses: {
        Row: {
          id: string
          user_id: string
          survey_type_id: string
          survey_phase: string // 'pre', 'post', 'follow-up'
          responses: Json
          completion_time_seconds: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          survey_type_id: string
          survey_phase: string
          responses: Json
          completion_time_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          survey_type_id?: string
          survey_phase?: string
          responses?: Json
          completion_time_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_type_id_fkey"
            columns: ["survey_type_id"]
            referencedRelation: "survey_types"
            referencedColumns: ["id"]
          }
        ]
      }
      
      // User progress tracking across survey phases
      user_survey_progress: {
        Row: {
          id: string
          user_id: string
          survey_type_id: string
          pre_survey_completed_at: string | null
          lesson_completed_at: string | null
          post_survey_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          survey_type_id: string
          pre_survey_completed_at?: string | null
          lesson_completed_at?: string | null
          post_survey_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          survey_type_id?: string
          pre_survey_completed_at?: string | null
          lesson_completed_at?: string | null
          post_survey_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_survey_progress_survey_type_id_fkey"
            columns: ["survey_type_id"]
            referencedRelation: "survey_types"
            referencedColumns: ["id"]
          }
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

// Utility types for easier database access
type DatabaseWithoutInternals = Database

type DefaultSchema = DatabaseWithoutInternals["public"]

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
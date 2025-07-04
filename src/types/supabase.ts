
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
      admin_audit_trail: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: number
          ip_address: unknown | null
          resource_id: string
          resource_type: string
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: unknown | null
          resource_id: string
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: unknown | null
          resource_id?: string
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_trail_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_promotions: {
        Row: {
          id: string
          ip_address: unknown | null
          new_role: string
          previous_role: string
          promoted_at: string | null
          promoted_by: string
          reason: string
          revocation_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          new_role?: string
          previous_role?: string
          promoted_at?: string | null
          promoted_by: string
          reason: string
          revocation_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          new_role?: string
          previous_role?: string
          promoted_at?: string | null
          promoted_by?: string
          reason?: string
          revocation_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_promotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          archived_at: string | null
          content: string
          created_at: string | null
          created_by: string
          engagement_rate: number | null
          id: number
          priority: string | null
          published_at: string | null
          scheduled_for: string | null
          status: string | null
          tags: string[] | null
          target_audience: string | null
          target_user_id: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          archived_at?: string | null
          content: string
          created_at?: string | null
          created_by: string
          engagement_rate?: number | null
          id?: number
          priority?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          tags?: string[] | null
          target_audience?: string | null
          target_user_id?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          archived_at?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          engagement_rate?: number | null
          id?: number
          priority?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          tags?: string[] | null
          target_audience?: string | null
          target_user_id?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          id: string
          issue_date: string | null
          issuing_organization: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          affiliate_id: string
          commission_amount: number
          course_id: string
          created_at: string
          id: string
          invited_user_id: string
          payment_id: string
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          course_id: string
          created_at?: string
          id?: string
          invited_user_id: string
          payment_id: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          course_id?: string
          created_at?: string
          id?: string
          invited_user_id?: string
          payment_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_free: boolean
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean
          title?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          rating: number | null
          segment_id: string
          status: string
          text_feedback: string | null
          user_id: string
          video_feedback_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating?: number | null
          segment_id: string
          status?: string
          text_feedback?: string | null
          user_id: string
          video_feedback_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number | null
          segment_id?: string
          status?: string
          text_feedback?: string | null
          user_id?: string
          video_feedback_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          created_at: string
          id: string
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          topic: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          affiliate_id: string
          code_text: string
          created_at: string
          id: string
          is_active: boolean
          uses: number
        }
        Insert: {
          affiliate_id: string
          code_text: string
          created_at?: string
          id?: string
          is_active?: boolean
          uses?: number
        }
        Update: {
          affiliate_id?: string
          code_text?: string
          created_at?: string
          id?: string
          is_active?: boolean
          uses?: number
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          created_at: string
          id: string
          language_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "languages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_goals: {
        Row: {
          created_at: string
          goal: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: number
          in_app_enabled: boolean | null
          push_enabled: boolean | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: number
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: number
          in_app_enabled?: boolean | null
          push_enabled?: boolean | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string
          created_at: string | null
          data: Json | null
          expires_at: string | null
          icon: string | null
          id: number
          image_url: string | null
          message: string
          metadata: Json | null
          priority: string | null
          read_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          icon?: string | null
          id?: number
          image_url?: string | null
          message: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          icon?: string | null
          id?: number
          image_url?: string | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          provider_transaction_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          provider_transaction_id: string
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          provider_transaction_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          admin_notes: string | null
          affiliate_id: string
          amount: number
          completed_at: string | null
          id: string
          requested_at: string
          status: string
        }
        Insert: {
          admin_notes?: string | null
          affiliate_id: string
          amount: number
          completed_at?: string | null
          id?: string
          requested_at?: string
          status?: string
        }
        Update: {
          admin_notes?: string | null
          affiliate_id?: string
          amount?: number
          completed_at?: string | null
          id?: string
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          key: string
          value: Json | null
        }
        Insert: {
          description?: string | null
          key: string
          value?: Json | null
        }
        Update: {
          description?: string | null
          key?: string
          value?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability: string | null
          avatar_url: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          education_level: string | null
          email: string | null
          experience_level: string | null
          full_name: string | null
          gender: string | null
          graduation_year: number | null
          id: string
          institution: string | null
          invited_by: string | null
          language: string | null
          onboarding_completed: boolean | null
          onboarding_data: Json | null
          phone_number: string | null
          professional_role: string | null
          role: string
          specialization: string | null
          status: string
          timezone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          availability?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          gender?: string | null
          graduation_year?: number | null
          id: string
          institution?: string | null
          invited_by?: string | null
          language?: string | null
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          phone_number?: string | null
          professional_role?: string | null
          role?: string
          specialization?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          availability?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          gender?: string | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          invited_by?: string | null
          language?: string | null
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          phone_number?: string | null
          professional_role?: string | null
          role?: string
          specialization?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      progress: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean
          segment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean
          segment_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean
          segment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          course_id: string
          created_at: string
          id: string
          pdf_url: string | null
          segment_order: number
          title: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          pdf_url?: string | null
          segment_order: number
          title: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          pdf_url?: string | null
          segment_order?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "segments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      admin_audit_trail_detailed: {
        Row: {
          action: string | null
          admin_email: string | null
          admin_name: string | null
          admin_username: string | null
          created_at: string | null
          details: Json | null
          id: number | null
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          user_agent: string | null
        }
        Relationships: []
      }
      admin_promotion_history: {
        Row: {
          id: string | null
          ip_address: unknown | null
          new_role: string | null
          previous_role: string | null
          promoted_at: string | null
          promoted_by: string | null
          promoted_by_email: string | null
          promoted_by_name: string | null
          reason: string | null
          revocation_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          session_id: string | null
          user_agent: string | null
          user_email: string | null
          user_full_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_promotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_expired_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_default_notification_preferences: {
        Args: { user_id: string }
        Returns: undefined
      }
      create_maintenance_notification: {
        Args: {
          p_maintenance_date: string
          p_duration_hours: number
          p_description: string
        }
        Returns: number
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_category: string
          p_title: string
          p_message: string
          p_data?: Json
          p_action_url?: string
          p_priority?: string
          p_expires_at?: string
          p_icon?: string
          p_image_url?: string
        }
        Returns: number
      }
      create_notifications_for_role: {
        Args: {
          p_role: string
          p_type: string
          p_category: string
          p_title: string
          p_message: string
          p_data?: Json
          p_action_url?: string
          p_priority?: string
          p_expires_at?: string
          p_icon?: string
        }
        Returns: number
      }
      create_revenue_milestone_notification: {
        Args: {
          p_milestone_amount: number
          p_current_amount: number
          p_period: string
        }
        Returns: number
      }
      create_security_alert: {
        Args: {
          p_user_id: string
          p_alert_type: string
          p_message: string
          p_severity?: string
        }
        Returns: number
      }
      delete_storage_object: {
        Args: { bucket_name: string; object_path: string }
        Returns: undefined
      }
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      promote_user_to_admin: {
        Args: {
          target_user_id: string
          promoted_by_admin_id: string
          promotion_reason?: string
        }
        Returns: boolean
      }
      send_assignment_due_reminders: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
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
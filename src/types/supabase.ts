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
      payment_details: {
        Row: {
          card_number: string | null
          created_at: string
          disabled_reason: string | null
          hourly_rate: number | null
          id: string
          onboarding_completed: boolean | null
          stripe_account_id: string | null
        }
        Insert: {
          card_number?: string | null
          created_at?: string
          disabled_reason?: string | null
          hourly_rate?: number | null
          id: string
          onboarding_completed?: boolean | null
          stripe_account_id?: string | null
        }
        Update: {
          card_number?: string | null
          created_at?: string
          disabled_reason?: string | null
          hourly_rate?: number | null
          id?: string
          onboarding_completed?: boolean | null
          stripe_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          payment_intent_id: string | null
          payout_due_date: string | null
          refund_id: string | null
          session_id: string | null
          status: string | null
          student_id: string | null
          teacher_amount: number | null
          teacher_id: string | null
          withdrawal_id: string | null
          withdrawn: boolean | null
          withdrawn_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          payment_intent_id?: string | null
          payout_due_date?: string | null
          refund_id?: string | null
          session_id?: string | null
          status?: string | null
          student_id?: string | null
          teacher_amount?: number | null
          teacher_id?: string | null
          withdrawal_id?: string | null
          withdrawn?: boolean | null
          withdrawn_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          payment_intent_id?: string | null
          payout_due_date?: string | null
          refund_id?: string | null
          session_id?: string | null
          status?: string | null
          student_id?: string | null
          teacher_amount?: number | null
          teacher_id?: string | null
          withdrawal_id?: string | null
          withdrawn?: boolean | null
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          feedbacks: string[] | null
          id: string
          personal_feedback: string | null
          published_at: string
          stars: number | null
          student_id: string | null
          teacher_id: string | null
        }
        Insert: {
          feedbacks?: string[] | null
          id?: string
          personal_feedback?: string | null
          published_at?: string
          stars?: number | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          feedbacks?: string[] | null
          id?: string
          personal_feedback?: string | null
          published_at?: string
          stars?: number | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          durationInMins: number | null
          id: string
          scheduledAt: string | null
          startsAt: string | null
          status: string | null
          student_id: string | null
          teacher_id: string | null
        }
        Insert: {
          created_at?: string
          durationInMins?: number | null
          id?: string
          scheduledAt?: string | null
          startsAt?: string | null
          status?: string | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          created_at?: string
          durationInMins?: number | null
          id?: string
          scheduledAt?: string | null
          startsAt?: string | null
          status?: string | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          available_hours: Json | null
          bio: string | null
          country: string | null
          created_at: string
          email: string | null
          expertise: string | null
          id: string
          image_url: string | null
          name: string | null
          role: string | null
          topics: string[] | null
        }
        Insert: {
          available_hours?: Json | null
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          expertise?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          role?: string | null
          topics?: string[] | null
        }
        Update: {
          available_hours?: Json | null
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          expertise?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          role?: string | null
          topics?: string[] | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          status: string | null
          teacher_id: string | null
          transfer_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          status?: string | null
          teacher_id?: string | null
          transfer_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          status?: string | null
          teacher_id?: string | null
          transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_popular_topics: {
        Args: Record<PropertyKey, never>
        Returns: {
          topic: string
          count: number
        }[]
      }
      get_teacher_review_stats: {
        Args: { teacher_id_input: string }
        Returns: {
          review_count: number
          average_score: number
        }[]
      }
      search_teachers: {
        Args: {
          search?: string
          selected_topics?: string[]
          start_price?: number
          end_price?: number
          start_rating?: number
          end_rating?: number
        }
        Returns: {
          id: string
          name: string
          role: string
          email: string
          expertise: string
          bio: string
          image_url: string
          topics: string[]
          hourly_rate: number
          avg_rating: number
        }[]
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

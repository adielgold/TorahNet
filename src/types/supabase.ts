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
      get_teacher_review_stats: {
        Args: {
          teacher_id_input: string
        }
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

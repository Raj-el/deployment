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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          company_size: string | null
          contract_value: number | null
          created_at: string | null
          id: string
          industry: string | null
          mrr: number | null
          name: string
          renewal_date: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_size?: string | null
          contract_value?: number | null
          created_at?: string | null
          id?: string
          industry?: string | null
          mrr?: number | null
          name: string
          renewal_date?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_size?: string | null
          contract_value?: number | null
          created_at?: string | null
          id?: string
          industry?: string | null
          mrr?: number | null
          name?: string
          renewal_date?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          request_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          request_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["request_id"]
          },
        ]
      }
      analytics_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
        }
        Relationships: []
      }
      get_well_plans: {
        Row: {
          account_id: string | null
          assignee: string
          created_at: string | null
          due_date: string | null
          id: string
          priority: string
          progress: number | null
          start_date: string | null
          status: string
          target_health_score: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          assignee: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number | null
          start_date?: string | null
          status?: string
          target_health_score?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          assignee?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number | null
          start_date?: string | null
          status?: string
          target_health_score?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "get_well_plans_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      health_scores: {
        Row: {
          account_id: string | null
          created_at: string | null
          engagement_score: number
          financial_score: number
          id: string
          last_updated: string | null
          overall_score: number
          risk_level: string
          sentiment_score: number
          usage_score: number
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          engagement_score: number
          financial_score: number
          id?: string
          last_updated?: string | null
          overall_score: number
          risk_level?: string
          sentiment_score: number
          usage_score: number
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          engagement_score?: number
          financial_score?: number
          id?: string
          last_updated?: string | null
          overall_score?: number
          risk_level?: string
          sentiment_score?: number
          usage_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_scores_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_milestones: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          milestone_name: string
          project_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_name: string
          project_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_name?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "onboarding_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_projects: {
        Row: {
          account_id: string | null
          created_at: string | null
          csm_assignee: string
          id: string
          phase: string
          progress: number | null
          project_name: string
          start_date: string | null
          status: string
          target_completion: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          csm_assignee: string
          id?: string
          phase?: string
          progress?: number | null
          project_name: string
          start_date?: string | null
          status?: string
          target_completion?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          csm_assignee?: string
          id?: string
          phase?: string
          progress?: number | null
          project_name?: string
          start_date?: string | null
          status?: string
          target_completion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_projects_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_tasks: {
        Row: {
          assignee: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          plan_id: string | null
          title: string
        }
        Insert: {
          assignee?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          plan_id?: string | null
          title: string
        }
        Update: {
          assignee?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          plan_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_tasks_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "get_well_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      replies: {
        Row: {
          contact: string
          content: string
          id: string
          owner: string
          received_at: string
          request_id: string
          sim: string | null
          timestamp: string
        }
        Insert: {
          contact: string
          content: string
          id?: string
          owner: string
          received_at?: string
          request_id: string
          sim?: string | null
          timestamp: string
        }
        Update: {
          contact?: string
          content?: string
          id?: string
          owner?: string
          received_at?: string
          request_id?: string
          sim?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["request_id"]
          },
        ]
      }
      requests: {
        Row: {
          case_details: string
          created_at: string
          frequency_hours: number
          id: string
          reply_send_via: string
          reply_to: string
          request_id: string
          service_provider: string
          station_id: string
          suspect_name: string
          suspect_number: string
          updated_at: string
          upto_date: string
        }
        Insert: {
          case_details: string
          created_at?: string
          frequency_hours: number
          id?: string
          reply_send_via: string
          reply_to: string
          request_id: string
          service_provider: string
          station_id: string
          suspect_name: string
          suspect_number: string
          updated_at?: string
          upto_date: string
        }
        Update: {
          case_details?: string
          created_at?: string
          frequency_hours?: number
          id?: string
          reply_send_via?: string
          reply_to?: string
          request_id?: string
          service_provider?: string
          station_id?: string
          suspect_name?: string
          suspect_number?: string
          updated_at?: string
          upto_date?: string
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

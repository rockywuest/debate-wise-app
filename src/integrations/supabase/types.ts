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
      argument_ratings: {
        Row: {
          argument_id: string
          created_at: string
          id: string
          rated_by_user_id: string
          rating_type: string
        }
        Insert: {
          argument_id: string
          created_at?: string
          id?: string
          rated_by_user_id: string
          rating_type: string
        }
        Update: {
          argument_id?: string
          created_at?: string
          id?: string
          rated_by_user_id?: string
          rating_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "argument_ratings_argument_id_fkey"
            columns: ["argument_id"]
            isOneToOne: false
            referencedRelation: "argumente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "argument_ratings_rated_by_user_id_fkey"
            columns: ["rated_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      argumente: {
        Row: {
          aktualisiert_am: string
          argument_text: string
          argument_typ: Database["public"]["Enums"]["argument_typ"]
          autor_name: string | null
          benutzer_id: string
          debatten_id: string
          eltern_id: string | null
          erstellt_am: string
          id: string
        }
        Insert: {
          aktualisiert_am?: string
          argument_text: string
          argument_typ: Database["public"]["Enums"]["argument_typ"]
          autor_name?: string | null
          benutzer_id: string
          debatten_id: string
          eltern_id?: string | null
          erstellt_am?: string
          id?: string
        }
        Update: {
          aktualisiert_am?: string
          argument_text?: string
          argument_typ?: Database["public"]["Enums"]["argument_typ"]
          autor_name?: string | null
          benutzer_id?: string
          debatten_id?: string
          eltern_id?: string | null
          erstellt_am?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "argumente_debatten_id_fkey"
            columns: ["debatten_id"]
            isOneToOne: false
            referencedRelation: "debatten"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "argumente_eltern_id_fkey"
            columns: ["eltern_id"]
            isOneToOne: false
            referencedRelation: "argumente"
            referencedColumns: ["id"]
          },
        ]
      }
      debatten: {
        Row: {
          aktualisiert_am: string
          beschreibung: string | null
          erstellt_am: string
          erstellt_von: string
          id: string
          titel: string
        }
        Insert: {
          aktualisiert_am?: string
          beschreibung?: string | null
          erstellt_am?: string
          erstellt_von: string
          id?: string
          titel: string
        }
        Update: {
          aktualisiert_am?: string
          beschreibung?: string | null
          erstellt_am?: string
          erstellt_von?: string
          id?: string
          titel?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          reputation_score: number
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          reputation_score?: number
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          reputation_score?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          count: number
          id: string
          user_id: string | null
          window_start: string
        }
        Insert: {
          action_type: string
          count?: number
          id?: string
          user_id?: string | null
          window_start?: string
        }
        Update: {
          action_type?: string
          count?: number
          id?: string
          user_id?: string | null
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation_transactions: {
        Row: {
          created_at: string
          granted_by_user_id: string | null
          id: string
          points: number
          reason: string
          related_argument_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by_user_id?: string | null
          id?: string
          points: number
          reason: string
          related_argument_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by_user_id?: string | null
          id?: string
          points?: number
          reason?: string
          related_argument_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reputation_transactions_granted_by_user_id_fkey"
            columns: ["granted_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_transactions_related_argument_id_fkey"
            columns: ["related_argument_id"]
            isOneToOne: false
            referencedRelation: "argumente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_log: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      check_rate_limit: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_max_count?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      secure_rate_argument: {
        Args: {
          p_argument_id: string
          p_rating_type: string
          p_user_id: string
        }
        Returns: Json
      }
      update_user_reputation: {
        Args: {
          target_user_id: string
          points: number
          reason: string
          argument_id?: string
          granted_by?: string
        }
        Returns: undefined
      }
      update_user_reputation_secure: {
        Args: {
          target_user_id: string
          points: number
          reason: string
          argument_id?: string
          granted_by?: string
        }
        Returns: undefined
      }
      validate_argument_creation: {
        Args: {
          p_user_id: string
          p_debate_id: string
          p_argument_text: string
        }
        Returns: boolean
      }
    }
    Enums: {
      argument_typ: "These" | "Pro" | "Contra"
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
    Enums: {
      argument_typ: ["These", "Pro", "Contra"],
    },
  },
} as const

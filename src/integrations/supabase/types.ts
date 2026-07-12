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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      article_history: {
        Row: {
          action_type: string
          article_id: string
          id: string
          modified_at: string
          modified_by: string
          old_content: string | null
          old_seo_keywords: string | null
          old_title: string | null
        }
        Insert: {
          action_type: string
          article_id: string
          id?: string
          modified_at?: string
          modified_by?: string
          old_content?: string | null
          old_seo_keywords?: string | null
          old_title?: string | null
        }
        Update: {
          action_type?: string
          article_id?: string
          id?: string
          modified_at?: string
          modified_by?: string
          old_content?: string | null
          old_seo_keywords?: string | null
          old_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_history_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_image_url: string | null
          author_name: string | null
          breaking_duration: number | null
          category: string
          content: string | null
          created_at: string
          description: string | null
          hash: string
          id: string
          image_url: string | null
          is_breaking: boolean
          is_manual: boolean
          language: string
          published_at: string | null
          seo_keywords: string | null
          show_source: boolean
          source_id: string | null
          title: string
          url: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          author_image_url?: string | null
          author_name?: string | null
          breaking_duration?: number | null
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          hash: string
          id?: string
          image_url?: string | null
          is_breaking?: boolean
          is_manual?: boolean
          language: string
          published_at?: string | null
          seo_keywords?: string | null
          show_source?: boolean
          source_id?: string | null
          title: string
          url: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          author_image_url?: string | null
          author_name?: string | null
          breaking_duration?: number | null
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          hash?: string
          id?: string
          image_url?: string | null
          is_breaking?: boolean
          is_manual?: boolean
          language?: string
          published_at?: string | null
          seo_keywords?: string | null
          show_source?: boolean
          source_id?: string | null
          title?: string
          url?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      breaking_news_settings: {
        Row: {
          auto_refresh: boolean
          created_at: string
          id: string
          is_active: boolean
          scroll_direction: string
          scroll_speed: number
          separator_style: string
          updated_at: string
        }
        Insert: {
          auto_refresh?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          scroll_direction?: string
          scroll_speed?: number
          separator_style?: string
          updated_at?: string
        }
        Update: {
          auto_refresh?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          scroll_direction?: string
          scroll_speed?: number
          separator_style?: string
          updated_at?: string
        }
        Relationships: []
      }
      currencies: {
        Row: {
          change_percent: number | null
          code: string
          id: string
          is_active: boolean
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          change_percent?: number | null
          code: string
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          change_percent?: number | null
          code?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      currency_ticker_settings: {
        Row: {
          auto_refresh: boolean
          created_at: string
          id: string
          scroll_direction: string
          scroll_speed: number
          updated_at: string
        }
        Insert: {
          auto_refresh?: boolean
          created_at?: string
          id?: string
          scroll_direction?: string
          scroll_speed?: number
          updated_at?: string
        }
        Update: {
          auto_refresh?: boolean
          created_at?: string
          id?: string
          scroll_direction?: string
          scroll_speed?: number
          updated_at?: string
        }
        Relationships: []
      }
      fetch_settings: {
        Row: {
          auto_fetch_enabled: boolean
          created_at: string
          fetch_interval: number
          id: string
          last_fetch_count: number | null
          last_fetch_time: string | null
          updated_at: string
        }
        Insert: {
          auto_fetch_enabled?: boolean
          created_at?: string
          fetch_interval?: number
          id?: string
          last_fetch_count?: number | null
          last_fetch_time?: string | null
          updated_at?: string
        }
        Update: {
          auto_fetch_enabled?: boolean
          created_at?: string
          fetch_interval?: number
          id?: string
          last_fetch_count?: number | null
          last_fetch_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      news_sources: {
        Row: {
          alt_source_name: string | null
          alt_source_url: string | null
          article_count: number | null
          category: string | null
          created_at: string
          feed_url: string | null
          fetch_type: string
          id: string
          is_active: boolean
          language: string
          last_fetch: string | null
          last_fetch_status: string | null
          name: string
          show_source: boolean
          slug: string | null
          updated_at: string
          url: string
          website_url: string | null
        }
        Insert: {
          alt_source_name?: string | null
          alt_source_url?: string | null
          article_count?: number | null
          category?: string | null
          created_at?: string
          feed_url?: string | null
          fetch_type?: string
          id?: string
          is_active?: boolean
          language: string
          last_fetch?: string | null
          last_fetch_status?: string | null
          name: string
          show_source?: boolean
          slug?: string | null
          updated_at?: string
          url: string
          website_url?: string | null
        }
        Update: {
          alt_source_name?: string | null
          alt_source_url?: string | null
          article_count?: number | null
          category?: string | null
          created_at?: string
          feed_url?: string | null
          fetch_type?: string
          id?: string
          is_active?: boolean
          language?: string
          last_fetch?: string | null
          last_fetch_status?: string | null
          name?: string
          show_source?: boolean
          slug?: string | null
          updated_at?: string
          url?: string
          website_url?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          article_id: string | null
          created_at: string
          id: string
          page_path: string
          session_id: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          id?: string
          page_path: string
          session_id: string
        }
        Update: {
          article_id?: string | null
          created_at?: string
          id?: string
          page_path?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      smart_categorize_ar: { Args: { _text: string }; Returns: string }
      smart_categorize_en: { Args: { _text: string }; Returns: string }
    }
    Enums: {
      app_role: "admin"
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
    Enums: {
      app_role: ["admin"],
    },
  },
} as const

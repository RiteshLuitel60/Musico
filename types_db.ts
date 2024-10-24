// Define JSON type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define Database structure
export type Database = {
  public: {
    Tables: {
      // Customer table
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      // Liked songs table
      liked_songs: {
        Row: {
          album_name: string | null
          artist_id: string | null
          audio_file_url: string | null
          duration_in_millis: number | null
          genre_names: string[] | null
          image_url: string | null
          is_apple_digital_master: boolean | null
          is_explicit: boolean | null
          lyrics: string | null
          name: string
          play_params_id: string | null
          preview_url: string | null
          provider_caption: string | null
          provider_image_url: string | null
          provider_type: string | null
          provider_uri: string | null
          release_date: string | null
          user_id: string
        }
        Insert: {
          album_name?: string | null
          artist_id?: string | null
          audio_file_url?: string | null
          duration_in_millis?: number | null
          genre_names?: string[] | null
          image_url?: string | null
          is_apple_digital_master?: boolean | null
          is_explicit?: boolean | null
          lyrics?: string | null
          name: string
          play_params_id?: string | null
          preview_url?: string | null
          provider_caption?: string | null
          provider_image_url?: string | null
          provider_type?: string | null
          provider_uri?: string | null
          release_date?: string | null
          user_id: string
        }
        Update: {
          album_name?: string | null
          artist_id?: string | null
          audio_file_url?: string | null
          duration_in_millis?: number | null
          genre_names?: string[] | null
          image_url?: string | null
          is_apple_digital_master?: boolean | null
          is_explicit?: boolean | null
          lyrics?: string | null
          name?: string
          play_params_id?: string | null
          preview_url?: string | null
          provider_caption?: string | null
          provider_image_url?: string | null
          provider_type?: string | null
          provider_uri?: string | null
          release_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liked_songs_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      // Prices table
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      // Products table
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      // Songs table
      songs: {
        Row: {
          album_name: string | null
          artist_name: string | null
          artwork_url: string | null
          audio_locale: string | null
          audio_traits: string[] | null
          background_image_url: string | null
          composer_name: string | null
          disc_number: number | null
          duration_in_millis: number | null
          explicit: boolean | null
          genre_names: string[] | null
          has_lyrics: boolean | null
          has_time_synced_lyrics: boolean | null
          id: string
          is_apple_digital_master: boolean | null
          is_vocal_attenuation_allowed: boolean | null
          isrc: string | null
          music_video_url: string | null
          name: string | null
          play_params_id: string | null
          preview_url: string | null
          provider_caption: string | null
          provider_image_url: string | null
          provider_type: string | null
          provider_uri: string | null
          release_date: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          album_name?: string | null
          artist_name?: string | null
          artwork_url?: string | null
          audio_locale?: string | null
          audio_traits?: string[] | null
          background_image_url?: string | null
          composer_name?: string | null
          disc_number?: number | null
          duration_in_millis?: number | null
          explicit?: boolean | null
          genre_names?: string[] | null
          has_lyrics?: boolean | null
          has_time_synced_lyrics?: boolean | null
          id: string
          is_apple_digital_master?: boolean | null
          is_vocal_attenuation_allowed?: boolean | null
          isrc?: string | null
          music_video_url?: string | null
          name?: string | null
          play_params_id?: string | null
          preview_url?: string | null
          provider_caption?: string | null
          provider_image_url?: string | null
          provider_type?: string | null
          provider_uri?: string | null
          release_date?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          album_name?: string | null
          artist_name?: string | null
          artwork_url?: string | null
          audio_locale?: string | null
          audio_traits?: string[] | null
          background_image_url?: string | null
          composer_name?: string | null
          disc_number?: number | null
          duration_in_millis?: number | null
          explicit?: boolean | null
          genre_names?: string[] | null
          has_lyrics?: boolean | null
          has_time_synced_lyrics?: boolean | null
          id?: string
          is_apple_digital_master?: boolean | null
          is_vocal_attenuation_allowed?: boolean | null
          isrc?: string | null
          music_video_url?: string | null
          name?: string | null
          play_params_id?: string | null
          preview_url?: string | null
          provider_caption?: string | null
          provider_image_url?: string | null
          provider_type?: string | null
          provider_uri?: string | null
          release_date?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: []
      }
      // Subscriptions table
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      // Users table
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Define PublicSchema type
type PublicSchema = Database[Extract<keyof Database, "public">]

// Define Tables type
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

// Define TablesInsert type
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

// Define TablesUpdate type
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

// Define Enums type
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

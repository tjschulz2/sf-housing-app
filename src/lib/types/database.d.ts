type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Database = {
  public: {
    Tables: {
      communities: {
        Row: {
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          custom_space_slug: string | null;
          description: string | null;
          image_url: string | null;
          last_updated_date: string | null;
          location: number | null;
          name: string | null;
          pref_contact_method: string | null;
          profile_id: number;
          resident_count: number | null;
          room_price_range: number | null;
          space_slug: string | null;
          user_id: string;
          website_url: string | null;
        };
        Insert: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          custom_space_slug?: string | null;
          description?: string | null;
          image_url?: string | null;
          last_updated_date?: string | null;
          location?: number | null;
          name?: string | null;
          pref_contact_method?: string | null;
          profile_id?: number;
          resident_count?: number | null;
          room_price_range?: number | null;
          space_slug?: string | null;
          user_id: string;
          website_url?: string | null;
        };
        Update: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          custom_space_slug?: string | null;
          description?: string | null;
          image_url?: string | null;
          last_updated_date?: string | null;
          location?: number | null;
          name?: string | null;
          pref_contact_method?: string | null;
          profile_id?: number;
          resident_count?: number | null;
          room_price_range?: number | null;
          space_slug?: string | null;
          user_id?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "communities_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      confirmation_codes: {
        Row: {
          code: number;
          created_at: string | null;
          email: string | null;
        };
        Insert: {
          code?: number;
          created_at?: string | null;
          email?: string | null;
        };
        Update: {
          code?: number;
          created_at?: string | null;
          email?: string | null;
        };
        Relationships: [];
      };
      follow_intersections: {
        Row: {
          intersection_count: number | null;
          last_updated: string;
          user_1_id: string;
          user_2_id: string;
        };
        Insert: {
          intersection_count?: number | null;
          last_updated?: string;
          user_1_id: string;
          user_2_id: string;
        };
        Update: {
          intersection_count?: number | null;
          last_updated?: string;
          user_1_id?: string;
          user_2_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follow_intersections_user_1_id_fkey";
            columns: ["user_1_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "follow_intersections_user_2_id_fkey";
            columns: ["user_2_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      housing_search_profiles: {
        Row: {
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
          last_updated_date: string | null;
          link: string | null;
          pref_contact_method: string | null;
          pref_housemate_count: number | null;
          pref_housemate_details: string | null;
          pref_housing_type: number | null;
          pref_move_in: number | null;
          profile_id: number;
          user_id: string;
        };
        Insert: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          last_updated_date?: string | null;
          link?: string | null;
          pref_contact_method?: string | null;
          pref_housemate_count?: number | null;
          pref_housemate_details?: string | null;
          pref_housing_type?: number | null;
          pref_move_in?: number | null;
          profile_id?: number;
          user_id: string;
        };
        Update: {
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          last_updated_date?: string | null;
          link?: string | null;
          pref_contact_method?: string | null;
          pref_housemate_count?: number | null;
          pref_housemate_details?: string | null;
          pref_housing_type?: number | null;
          pref_move_in?: number | null;
          profile_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "housing_search_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      organizer_profiles: {
        Row: {
          created_at: string;
          last_updated_date: string | null;
          link: string | null;
          pref_contact_method: string | null;
          pref_house_details: string | null;
          pref_housemate_count: number | null;
          pref_housing_type: number | null;
          pref_lease_start: number | null;
          profile_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          last_updated_date?: string | null;
          link?: string | null;
          pref_contact_method?: string | null;
          pref_house_details?: string | null;
          pref_housemate_count?: number | null;
          pref_housing_type?: number | null;
          pref_lease_start?: number | null;
          profile_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          last_updated_date?: string | null;
          link?: string | null;
          pref_contact_method?: string | null;
          pref_house_details?: string | null;
          pref_housemate_count?: number | null;
          pref_housing_type?: number | null;
          pref_lease_start?: number | null;
          profile_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organizer_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      referral_recipients: {
        Row: {
          recipient_id: string;
          referral_id: number;
        };
        Insert: {
          recipient_id: string;
          referral_id?: number;
        };
        Update: {
          recipient_id?: string;
          referral_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "referral_recipients_referral_id_fkey";
            columns: ["referral_id"];
            isOneToOne: false;
            referencedRelation: "referrals";
            referencedColumns: ["referral_id"];
          }
        ];
      };
      referrals: {
        Row: {
          created_at: string | null;
          originator_id: string;
          referral_id: number;
          usage_count: number | null;
          usage_limit: number | null;
        };
        Insert: {
          created_at?: string | null;
          originator_id: string;
          referral_id?: number;
          usage_count?: number | null;
          usage_limit?: number | null;
        };
        Update: {
          created_at?: string | null;
          originator_id?: string;
          referral_id?: number;
          usage_count?: number | null;
          usage_limit?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "referrals_originator_id_fkey";
            columns: ["originator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      users: {
        Row: {
          available_referrals: number | null;
          community_id: number | null;
          contact_email: string | null;
          created_at: string | null;
          email: string | null;
          follows_last_refresh: string | null;
          is_super: boolean;
          name: string | null;
          phone_number: string | null;
          twitter_avatar_url: string | null;
          twitter_handle: string | null;
          twitter_id: string | null;
          user_id: string;
          website_url: string | null;
        };
        Insert: {
          available_referrals?: number | null;
          community_id?: number | null;
          contact_email?: string | null;
          created_at?: string | null;
          email?: string | null;
          follows_last_refresh?: string | null;
          is_super?: boolean;
          name?: string | null;
          phone_number?: string | null;
          twitter_avatar_url?: string | null;
          twitter_handle?: string | null;
          twitter_id?: string | null;
          user_id: string;
          website_url?: string | null;
        };
        Update: {
          available_referrals?: number | null;
          community_id?: number | null;
          contact_email?: string | null;
          created_at?: string | null;
          email?: string | null;
          follows_last_refresh?: string | null;
          is_super?: boolean;
          name?: string | null;
          phone_number?: string | null;
          twitter_avatar_url?: string | null;
          twitter_handle?: string | null;
          twitter_id?: string | null;
          user_id?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrement_available_referrals: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      this_month_listing_count: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

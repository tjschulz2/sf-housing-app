type User = {
  id: number;
  name: string;
  username: string;
};

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_CLIENT: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_JWT_SECRET: string;
    REDIS_URL: string;
    TWITTER_API_KEY: string;
  }
}

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          community_id: number;
          contact_email: string | null;
          created_at: string | null;
          description: string | null;
          image_url: string | null;
          name: string | null;
          owner_id: string | null;
          rent_max: number | null;
          rent_min: number | null;
          resident_count: number | null;
          website_url: string | null;
        };
        Insert: {
          community_id?: number;
          contact_email?: string | null;
          created_at?: string | null;
          description?: string | null;
          image_url?: string | null;
          name?: string | null;
          owner_id?: string | null;
          rent_max?: number | null;
          rent_min?: number | null;
          resident_count?: number | null;
          website_url?: string | null;
        };
        Update: {
          community_id?: number;
          contact_email?: string | null;
          created_at?: string | null;
          description?: string | null;
          image_url?: string | null;
          name?: string | null;
          owner_id?: string | null;
          rent_max?: number | null;
          rent_min?: number | null;
          resident_count?: number | null;
          website_url?: string | null;
        };
        Relationships: [];
      };
      follow_intersections: {
        Row: {
          id: number;
          intersection_count: number | null;
          last_updated: string | null;
          user_1_id: string | null;
          user_2_id: string | null;
        };
        Insert: {
          id?: number;
          intersection_count?: number | null;
          last_updated?: string | null;
          user_1_id?: string | null;
          user_2_id?: string | null;
        };
        Update: {
          id?: number;
          intersection_count?: number | null;
          last_updated?: string | null;
          user_1_id?: string | null;
          user_2_id?: string | null;
        };
        Relationships: [];
      };
      housing_search_profiles: {
        Row: {
          created_at: string | null;
          pref_contact_method: number | null;
          pref_housemate_count: number | null;
          pref_housemate_details: string | null;
          pref_housing_type: number | null;
          pref_move_in: string | null;
          user_id: number;
        };
        Insert: {
          created_at?: string | null;
          pref_contact_method?: number | null;
          pref_housemate_count?: number | null;
          pref_housemate_details?: string | null;
          pref_housing_type?: number | null;
          pref_move_in?: string | null;
          user_id: number;
        };
        Update: {
          created_at?: string | null;
          pref_contact_method?: number | null;
          pref_housemate_count?: number | null;
          pref_housemate_details?: string | null;
          pref_housing_type?: number | null;
          pref_move_in?: string | null;
          user_id?: number;
        };
        Relationships: [];
      };
      organizer_profiles: {
        Row: {
          created_at: string;
          pref_contact_method: number | null;
          pref_house_details: string | null;
          pref_housemate_count: number | null;
          pref_housing_type: number | null;
          pref_lease_start: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          pref_contact_method?: number | null;
          pref_house_details?: string | null;
          pref_housemate_count?: number | null;
          pref_housing_type?: number | null;
          pref_lease_start?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          pref_contact_method?: number | null;
          pref_house_details?: string | null;
          pref_housemate_count?: number | null;
          pref_housing_type?: number | null;
          pref_lease_start?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      referrals: {
        Row: {
          created_at: string | null;
          originator_id: string;
          recipient_id: string | null;
          referral_id: number;
        };
        Insert: {
          created_at?: string | null;
          originator_id: string;
          recipient_id?: string | null;
          referral_id?: number;
        };
        Update: {
          created_at?: string | null;
          originator_id?: string;
          recipient_id?: string | null;
          referral_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "referrals_originator_id_fkey";
            columns: ["originator_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "referrals_recipient_id_fkey";
            columns: ["recipient_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      users: {
        Row: {
          available_referrals: number | null;
          community_id: number | null;
          created_at: string | null;
          email: string | null;
          follows_last_refresh: string | null;
          name: string | null;
          phone_number: string | null;
          twitter_avatar_url: string | null;
          twitter_handle: string | null;
          twitter_id: string | null;
          user_id: string;
          website_url: string | null;
          contact_email: string | null;
        };
        Insert: {
          available_referrals?: number | null;
          community_id?: number | null;
          created_at?: string | null;
          email?: string | null;
          follows_last_refresh?: string | null;
          name?: string | null;
          phone_number?: string | null;
          twitter_avatar_url?: string | null;
          twitter_handle?: string | null;
          twitter_id?: string | null;
          user_id: string;
          website_url?: string | null;
          contact_email: string | null;
        };
        Update: {
          available_referrals?: number | null;
          community_id?: number | null;
          created_at?: string | null;
          email?: string | null;
          follows_last_refresh?: string | null;
          name?: string | null;
          phone_number?: string | null;
          twitter_avatar_url?: string | null;
          twitter_handle?: string | null;
          twitter_id?: string | null;
          user_id?: string;
          website_url?: string | null;
          contact_email: string | null;
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
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

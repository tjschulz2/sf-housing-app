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
          owner_id: number | null;
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
          owner_id?: number | null;
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
          owner_id?: number | null;
          rent_max?: number | null;
          rent_min?: number | null;
          resident_count?: number | null;
          website_url?: string | null;
        };
      };
      follow_intersections: {
        Row: {
          created_at: string | null;
          id: number;
          intersection_count: number | null;
          user_1_id: number | null;
          user_2_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          intersection_count?: number | null;
          user_1_id?: number | null;
          user_2_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          intersection_count?: number | null;
          user_1_id?: number | null;
          user_2_id?: number | null;
        };
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
      };
      referrals: {
        Row: {
          created_at: string | null;
          originator_id: string;
          recipient_id: string | null;
          referral_code: string | null;
          referral_id: number;
        };
        Insert: {
          created_at?: string | null;
          originator_id: string;
          recipient_id?: string | null;
          referral_code?: string | null;
          referral_id?: number;
        };
        Update: {
          created_at?: string | null;
          originator_id?: string;
          recipient_id?: string | null;
          referral_code?: string | null;
          referral_id?: number;
        };
      };
      users: {
        Row: {
          available_referrals: number | null;
          community_id: number | null;
          created_at: string | null;
          email: string | null;
          name: string | null;
          phone_number: string | null;
          twitter_avatar_url: string | null;
          twitter_id: string | null;
          user_id: string;
          website_url: string | null;
        };
        Insert: {
          available_referrals?: number | null;
          community_id?: number | null;
          created_at?: string | null;
          email?: string | null;
          name?: string | null;
          phone_number?: string | null;
          twitter_avatar_url?: string | null;
          twitter_id?: string | null;
          user_id: string;
          website_url?: string | null;
        };
        Update: {
          available_referrals?: number | null;
          community_id?: number | null;
          created_at?: string | null;
          email?: string | null;
          name?: string | null;
          phone_number?: string | null;
          twitter_avatar_url?: string | null;
          twitter_id?: string | null;
          user_id?: string;
          website_url?: string | null;
        };
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

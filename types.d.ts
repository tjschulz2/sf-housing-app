type User = {
  id: number;
  name: string;
  username: string;
};

declare module "*.svg" {
  const content: any;
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}

type ReferralDetails = {
  referralCreatedAt: string | null | undefined;
  originatorID: string | undefined;
  recipientID: string | null | undefined;
  referralID: number | undefined;
  originatorName: any;
  status: string;
} | null;

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_CLIENT: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_JWT_SECRET: string;
    REDIS_URL: string;
    TWITTER_API_KEY: string;
  }
}

type HousingSearchProfile =
  Database["public"]["Tables"]["housing_search_profiles"]["Row"] & {
    user: {
      name: string | null;
      twitter_avatar_url: string | null;
      twitter_handle: string | null;
    } | null;
  };

  type OrganizerProfile =
  Database["public"]["Tables"]["organizer_profiles"]["Row"] & {
    user: {
      name: string | null;
      twitter_avatar_url: string | null;
      twitter_handle: string | null;
    } | null;
  };

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          created_at: string | null
          description: string | null
          image_url: string | null
          name: string | null
          pref_contact_method: string | null
          profile_id: number
          resident_count: number | null
          room_price_range: number | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          name?: string | null
          pref_contact_method?: string | null
          profile_id?: number
          resident_count?: number | null
          room_price_range?: number | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          name?: string | null
          pref_contact_method?: string | null
          profile_id?: number
          resident_count?: number | null
          room_price_range?: number | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      confirmation_codes: {
        Row: {
          code: number
          created_at: string | null
          email: string | null
        }
        Insert: {
          code?: number
          created_at?: string | null
          email?: string | null
        }
        Update: {
          code?: number
          created_at?: string | null
          email?: string | null
        }
        Relationships: []
      }
      follow_intersections: {
        Row: {
          intersection_count: number | null
          last_updated: string
          user_1_id: string
          user_2_id: string
        }
        Insert: {
          intersection_count?: number | null
          last_updated?: string
          user_1_id: string
          user_2_id: string
        }
        Update: {
          intersection_count?: number | null
          last_updated?: string
          user_1_id?: string
          user_2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_intersections_user_1_id_fkey"
            columns: ["user_1_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follow_intersections_user_2_id_fkey"
            columns: ["user_2_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      housing_search_profiles: {
        Row: {
          created_at: string | null
          link: string | null
          pref_contact_method: string | null
          pref_housemate_count: number | null
          pref_housemate_details: string | null
          pref_housing_type: number | null
          pref_move_in: number | null
          profile_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          link?: string | null
          pref_contact_method?: string | null
          pref_housemate_count?: number | null
          pref_housemate_details?: string | null
          pref_housing_type?: number | null
          pref_move_in?: number | null
          profile_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          link?: string | null
          pref_contact_method?: string | null
          pref_housemate_count?: number | null
          pref_housemate_details?: string | null
          pref_housing_type?: number | null
          pref_move_in?: number | null
          profile_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "housing_search_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      organizer_profiles: {
        Row: {
          created_at: string
          link: string | null
          pref_contact_method: string | null
          pref_house_details: string | null
          pref_housemate_count: number | null
          pref_housing_type: number | null
          pref_lease_start: number | null
          profile_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          link?: string | null
          pref_contact_method?: string | null
          pref_house_details?: string | null
          pref_housemate_count?: number | null
          pref_housing_type?: number | null
          pref_lease_start?: number | null
          profile_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          link?: string | null
          pref_contact_method?: string | null
          pref_house_details?: string | null
          pref_housemate_count?: number | null
          pref_housing_type?: number | null
          pref_lease_start?: number | null
          profile_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizer_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          originator_id: string
          recipient_id: string | null
          referral_id: number
        }
        Insert: {
          created_at?: string | null
          originator_id: string
          recipient_id?: string | null
          referral_id?: number
        }
        Update: {
          created_at?: string | null
          originator_id?: string
          recipient_id?: string | null
          referral_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "referrals_originator_id_fkey"
            columns: ["originator_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      users: {
        Row: {
          available_referrals: number | null
          community_id: number | null
          contact_email: string | null
          created_at: string | null
          email: string | null
          follows_last_refresh: string | null
          name: string | null
          phone_number: string | null
          twitter_avatar_url: string | null
          twitter_handle: string | null
          twitter_id: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          available_referrals?: number | null
          community_id?: number | null
          contact_email?: string | null
          created_at?: string | null
          email?: string | null
          follows_last_refresh?: string | null
          name?: string | null
          phone_number?: string | null
          twitter_avatar_url?: string | null
          twitter_handle?: string | null
          twitter_id?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          available_referrals?: number | null
          community_id?: number | null
          contact_email?: string | null
          created_at?: string | null
          email?: string | null
          follows_last_refresh?: string | null
          name?: string | null
          phone_number?: string | null
          twitter_avatar_url?: string | null
          twitter_handle?: string | null
          twitter_id?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_available_referrals: {
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

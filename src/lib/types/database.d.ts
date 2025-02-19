type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
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
          last_updated: string | null;
          user_1_id: string;
          user_2_id: string;
        };
        Insert: {
          intersection_count?: number | null;
          last_updated?: string | null;
          user_1_id: string;
          user_2_id: string;
        };
        Update: {
          intersection_count?: number | null;
          last_updated?: string | null;
          user_1_id?: string;
          user_2_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follow_intersections_user_2_id_fkey";
            columns: ["user_2_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      function_logs: {
        Row: {
          id: number;
          log_message: string | null;
          log_time: string | null;
        };
        Insert: {
          id?: number;
          log_message?: string | null;
          log_time?: string | null;
        };
        Update: {
          id?: number;
          log_message?: string | null;
          log_time?: string | null;
        };
        Relationships: [];
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
      jobs: {
        Row: {
          company_description: string | null;
          company_logo_link: string | null;
          company_name: string | null;
          company_site: string | null;
          created_at: string;
          id: string;
          job_contact_twitter: string | null;
          job_description: string | null;
          job_levels: number[] | null;
          job_location: number[] | null;
          job_title: string | null;
        };
        Insert: {
          company_description?: string | null;
          company_logo_link?: string | null;
          company_name?: string | null;
          company_site?: string | null;
          created_at?: string;
          id?: string;
          job_contact_twitter?: string | null;
          job_description?: string | null;
          job_levels?: number[] | null;
          job_location?: number[] | null;
          job_title?: string | null;
        };
        Update: {
          company_description?: string | null;
          company_logo_link?: string | null;
          company_name?: string | null;
          company_site?: string | null;
          created_at?: string;
          id?: string;
          job_contact_twitter?: string | null;
          job_description?: string | null;
          job_levels?: number[] | null;
          job_location?: number[] | null;
          job_title?: string | null;
        };
        Relationships: [];
      };
      organizer_profiles: {
        Row: {
          created_at: string | null;
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
          created_at?: string | null;
          last_updated_date?: string | null;
          link?: string | null;
          pref_contact_method?: string | null;
          pref_house_details?: string | null;
          pref_housemate_count?: number | null;
          pref_housing_type?: number | null;
          pref_lease_start?: number | null;
          profile_id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
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
          referral_id: number | null;
        };
        Insert: {
          recipient_id: string;
          referral_id?: number | null;
        };
        Update: {
          recipient_id?: string;
          referral_id?: number | null;
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
      rental_images: {
        Row: {
          created_at: string | null;
          id: number;
          image_url: string;
          rental_id: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          image_url: string;
          rental_id: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          image_url?: string;
          rental_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "rental_images_rental_id_fkey";
            columns: ["rental_id"];
            isOneToOne: false;
            referencedRelation: "rentals";
            referencedColumns: ["id"];
          }
        ];
      };
      rentals: {
        Row: {
          address: string | null;
          available_date: string | null;
          bathrooms: number | null;
          bedrooms: number | null;
          created_at: string;
          deposit: number | null;
          description: string | null;
          email: string | null;
          first_name: string | null;
          id: number;
          last_name: string | null;
          monthly_rent: number | null;
          neighborhood: string | null;
          phone_number: string | null;
          property_type: string | null;
          sqft: number | null;
          type_of_person: string | null;
        };
        Insert: {
          address?: string | null;
          available_date?: string | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          created_at?: string;
          deposit?: number | null;
          description?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: number;
          last_name?: string | null;
          monthly_rent?: number | null;
          neighborhood?: string | null;
          phone_number?: string | null;
          property_type?: string | null;
          sqft?: number | null;
          type_of_person?: string | null;
        };
        Update: {
          address?: string | null;
          available_date?: string | null;
          bathrooms?: number | null;
          bedrooms?: number | null;
          created_at?: string;
          deposit?: number | null;
          description?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: number;
          last_name?: string | null;
          monthly_rent?: number | null;
          neighborhood?: string | null;
          phone_number?: string | null;
          property_type?: string | null;
          sqft?: number | null;
          type_of_person?: string | null;
        };
        Relationships: [];
      };
      twitter_followers_added: {
        Row: {
          created_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          available_referrals: number | null;
          community_id: number | null;
          contact_email: string | null;
          created_at: string | null;
          email: string | null;
          follows_last_refresh: string | null;
          is_super: boolean | null;
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
          is_super?: boolean | null;
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
          is_super?: boolean | null;
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
      delete_airtable_urls: {
        Args: {
          rental_id: number;
        };
        Returns: undefined;
      };
      get_total_members: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_user_by_id: {
        Args: {
          userid: string;
        };
        Returns: {
          available_referrals: number | null;
          community_id: number | null;
          contact_email: string | null;
          created_at: string | null;
          email: string | null;
          follows_last_refresh: string | null;
          is_super: boolean | null;
          name: string | null;
          phone_number: string | null;
          twitter_avatar_url: string | null;
          twitter_handle: string | null;
          twitter_id: string | null;
          user_id: string;
          website_url: string | null;
        };
      };
      handle_image_upload: {
        Args: {
          image_url: string;
          rental_id: number;
        };
        Returns: undefined;
      };
      handle_rental_data: {
        Args: {
          first_name: string;
          last_name: string;
          email: string;
          phone_number: string;
          type_of_person: string;
          address: string;
          monthly_rent: number;
          bedrooms: number;
          bathrooms: number;
          sqft: number;
          available_date: string;
          property_type: string;
          deposit: number;
          neighborhood: string;
          description: string;
          image_urls: string;
        };
        Returns: number;
      };
      insert_image_url: {
        Args: {
          rental_id: number;
          image_url: string;
        };
        Returns: undefined;
      };
      this_month_listing_count: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      update_image_url: {
        Args: {
          rental_id: number;
          old_image_url: string;
          new_image_url: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
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

type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

type User = {
  id: number;
  name: string;
  username: string;
};

declare module "*.svg" {
  const content: any;
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  export default content;
}

type CoreUserSessionData = {
  accessToken: string;
  userID: string;
  twitterAvatarURL: any;
  twitterEmail: any;
  twitterName: string;
  twitterHandle: string;
  twitterID: any;
};

type ReferralDetails = {
  referralCreatedAt: string | null | undefined;
  originatorID: string | undefined;
  //recipientID: string | null | undefined;
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

type SearcherProfilesFilterType = {
  leaseLength?: string;
  housemateCount?: string;
  movingTime?: string;
};

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

type CommunityProfile = Database["public"]["Tables"]["communities"]["Row"] & {
  user: {
    name: string | null;
    twitter_avatar_url: string | null;
    twitter_handle: string | null;
  } | null;
};

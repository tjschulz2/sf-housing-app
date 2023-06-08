import { supabase } from "../supabaseClient";
import { RedisClientType } from "redis";
import { getCurrentUser } from "./auth";

// ----- Users & Profiles -----

export async function getUserData(userID?: string) {
  // Returns all data from public.users for current user, if it exists

  // If userID not passed, attempts to retrieve from session
  userID = userID ?? (await getCurrentUser())?.userID;
  if (!userID) {
    throw "failed to find userID";
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userID);

  if (error) {
    console.error(error);
  } else if (data) {
    return data[0];
  }
}

export async function createUser(
  newUser: Database["public"]["Tables"]["users"]["Insert"]
) {
  const { data, error } = await supabase
    .from("users")
    .upsert(newUser, { onConflict: "user_id" })
    .select();

  if (error) {
    console.error(error);
    throw "error";
  } else {
    console.log(data);
    return data[0];
  }
}

export async function getHousingSearchProfiles(
  startIdx: number = 0,
  count: number = 25
) {
  let { data, error } = await supabase
    .from("housing_search_profiles")
    .select("*")
    .range(startIdx, startIdx + count);

  if (error) {
    console.error(error);
  } else {
    console.log(data);
    return data;
  }
}

// ----- Referrals -----

export async function genReferral(userID: string) {
  // Postgres RLS to ensure:
  // 1. Originator_id matches authenticated users's ID
  // 2. User has remaining referrals before executing query
  const { data, error } = await supabase
    .from("referrals")
    .insert([{ originator_id: userID }]);

  if (error) {
    console.error(error);
  } else {
    const availableReferrals = await decAvailableReferrals(userID);
    return [data, availableReferrals];
  }
}

export async function getReferralDetails(referralCode: string) {
  const { data, error } = await supabase
    .from("referrals")
    .select(
      `
  *,
  users (
    name
  )
`
    )
    .eq("referral_code", referralCode);
  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

async function decAvailableReferrals(userID: string) {
  // Postgres RLS to ensure:
  // 1. user_id matches authenticated users's ID

  const { data, error } = await supabase
    .rpc("decrement_available_referrals")
    .eq("user_id", userID);
  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getAvailableReferrals(userID: string) {
  // Postgres RLS to ensure:
  // 1. user_id matches authenticated users's ID

  let { data, error } = await supabase
    .from("users")
    .select("available_referrals")
    .eq("user_id", userID);
}

// ----- Redis: Twitter follow data -----

export async function storeFollowing(
  redisClient: RedisClientType<any, any, any>,
  userID: string,
  follows: Array<string>
) {
  if (!redisClient) {
    console.error("Failed to create Redis client");
  } else {
    const redisKey = `user-follows:${userID}`;
    return await redisClient.sAdd(redisKey, follows);
  }
}

export async function storeFollowers(
  redisClient: RedisClientType<any, any, any>,
  userID: string,
  followers: Array<string>
) {
  if (!redisClient) {
    console.error("Failed to create Redis client");
  } else {
    const redisKey = `user-followers:${userID}`;
    return await redisClient.sAdd(redisKey, followers);
  }
}

export async function getFollowIntersection(
  redisClient: RedisClientType<any, any, any>,
  userID1: string,
  userID2: string
) {
  // Computes and retrieves intersection between {user1 follows} and {user2 followers}
  const user1FollowsKey = `user-follows:${userID1}`;
  const user2FollowersKey = `user-followers:${userID2}`;
  return await redisClient.sInterCard(
    [user1FollowsKey, user2FollowersKey],
    1000
  );
}

export async function getFollowIntersections(
  redisClient: RedisClientType,
  primaryUserID: string,
  comparisonUserIDs: string[]
) {
  const primaryUserFollowsKey = `user-follows:${primaryUserID}`;

  const promises: Promise<number>[] = [];
  comparisonUserIDs.forEach((compUserID) => {
    const compUserFollowersKey = `user-followers:${compUserID}`;
    promises.push(
      redisClient.sInterCard(
        [primaryUserFollowsKey, compUserFollowersKey],
        1000
      )
    );
  });
  const results = Promise.all(promises);
  return results;
}

export async function fetchFromTwitter(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const defaultHeaders: Record<string, string> = {
    Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
  };

  options.headers = options.headers
    ? { ...(options.headers as Record<string, string>), ...defaultHeaders }
    : defaultHeaders;

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response;
}

export const twitter = {
  following: {
    getFromTwitter: async (twitterID: string) => {
      // server-only
      const twEndpoint = `https://api.twitter.com/2/users/${twitterID}/following`;
      let cursor = null;
      let following: User[] = [];

      do {
        const res = await fetchFromTwitter(
          `${twEndpoint}${cursor ? `?pagination_token=${cursor}` : ""}`
        );
        const data = await res.json();
        following = [...following, ...data.data];
        cursor = data.meta.next_token;
      } while (cursor);

      return following;
    },
    setToStore: storeFollowing,
  },
  followers: {
    getFromTwitter: async (twitterID: string) => {
      // server-only
      const twEndpoint = `https://api.twitter.com/2/users/${twitterID}/followers`;
      let cursor = null;
      let followers: User[] = [];

      do {
        const res = await fetchFromTwitter(
          `${twEndpoint}${cursor ? `?pagination_token=${cursor}` : ""}`
        );
        const data = await res.json();
        followers = [...followers, ...data.data];
        cursor = data.meta.next_token;
      } while (cursor);

      return followers;
    },
    setToStore: storeFollowers,
  },
  followIntersection: {
    compute: async () => {},
    setToStore: async () => {},
  },
};

import { supabase } from "../supabaseClient";
import { RedisClientType } from "redis";
import { getUserSession } from "./auth";
import { getCurrentTimestamp } from "./general";

// ----- Users & Profiles -----

export async function getUserData(userID?: string) {
  // Returns all data from public.users for current user, if it exists

  // If userID not passed, attempts to retrieve from session
  userID = userID ?? (await getUserSession())?.userID;
  if (!userID) {
    throw "failed to find userID";
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userID)
    .maybeSingle();

  if (error) {
    console.error(error);
  } else if (data) {
    return data;
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
  const { data, error } = await supabase
    .from("housing_search_profiles")
    .select(
      `
      *, user:users(name, twitter_handle, twitter_avatar_url)
    `
    )
    .range(startIdx, startIdx + count);
  // .eq("housing_search_profiles.user_id", "follow_intersections.user_id_1");

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getOrganizerProfiles(
  startIdx: number = 0,
  count: number = 25
) {
  const { data, error } = await supabase
    .from("organizer_profiles")
    .select(
      `
      *, user:users(name, twitter_handle, twitter_avatar_url)
    `
    )
    .range(startIdx, startIdx + count);
  // .eq("housing_search_profiles.user_id", "follow_intersections.user_id_1");

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getCommunities(
  startIdx: number = 0,
  count: number = 25
) {
  const { data, error } = await supabase
    .from("communities")
    .select(
      `
      *, user:users(name, twitter_handle, twitter_avatar_url)
    `
    )
    .range(startIdx, startIdx + count);
  // .eq("housing_search_profiles.user_id", "follow_intersections.user_id_1");

  if (error) {
    console.error(error);
  } else {
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
  originator:originator_id(name)`
    )
    .eq("referral_id", referralCode)
    .maybeSingle();

  let status;

  if (!data) {
    status = "invalid";
  } else if (data.recipient_id) {
    status = "claimed";
  } else {
    status = "unclaimed";
  }

  return {
    referralCreatedAt: data?.created_at,
    originatorID: data?.originator_id,
    recipientID: data?.recipient_id,
    referralID: data?.referral_id,
    // @ts-ignore
    originatorName: data?.originator.name,
    status,
  };
}

export async function claimReferral(referralID: string, userID: string) {
  const { data, error } = await supabase
    .from("referrals")
    .update({ recipient_id: userID })
    .eq("referral_id", referralID)
    .is("recipient_id", null)
    .select();
  if (error || data[0]?.recipient_id !== userID) {
    return { status: "error", message: "failed to claim referral" };
  }
  return { status: "success" };
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
  following: Array<string>
) {
  // Server only
  if (!redisClient) {
    return { status: "error", message: "Failed to create Redis client" };
  }
  try {
    const redisKey = `user-following:${userID}`;
    const result = await redisClient.sAdd(redisKey, following);
    return { status: "success", message: result };
  } catch (err) {
    return { status: "error", message: "Failed to push to Redis" };
  }
}

export async function storeFollowers(
  redisClient: RedisClientType<any, any, any>,
  userID: string,
  followers: Array<string>
) {
  // Server only
  if (!redisClient) {
    return { status: "error", message: "Failed to create Redis client" };
  }
  try {
    const redisKey = `user-followers:${userID}`;
    const result = await redisClient.sAdd(redisKey, followers);
    return { status: "success", message: result };
  } catch (err) {
    return { status: "error", message: "Failed to push to Redis" };
  }
}

async function computeFollowIntersection(userID1: string, userID2: string) {
  // Computes intersection (on server) between user1 (derived from accessToken), and user2 (passed in request)
  const accessToken = (await getUserSession())?.accessToken;
  if (!accessToken) {
    throw "failed to find access token";
  }
  const response = await fetch("/api/compute-follow-intersection", {
    method: "POST",
    headers: {
      accessToken,
    },
    body: JSON.stringify({ userID1, userID2 }),
  });
  if (response.status !== 200) {
    throw "failed to compute intersection";
  } else {
    const { intersectionCount } = await response.json();
    return intersectionCount;
  }
}

export async function storeFollowIntersection(
  userID1: string,
  userID2: string,
  intersectionCount: number
) {
  const { data, error } = await supabase
    .from("follow_intersections")
    .upsert(
      {
        user_1_id: userID1,
        user_2_id: userID2,
        intersection_count: intersectionCount,
        last_updated: getCurrentTimestamp(),
      }
      // { onConflict: "user_1_id, user_2_id" }
    )
    .select("intersection_count")
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
}

export async function getFollowIntersection(userID1: string, userID2: string) {
  // Retrieves intersection from cache (Postgres)
  let { data, error } = await supabase
    .from("follow_intersections")
    .select("intersection_count")
    .eq("user_1_id", userID1)
    .eq("user_2_id", userID2)
    .maybeSingle();

  if (error) {
    throw error;
  } else {
    return data;
  }
}

export async function getFollowIntersectionWithCaching(
  userID1: string,
  userID2: string
) {
  try {
    let intersectionCount;
    const cachedIntersection = await getFollowIntersection(userID1, userID2);

    if (typeof cachedIntersection?.intersection_count === "number") {
      intersectionCount = cachedIntersection.intersection_count;
      console.log("cache HIT");
    } else if (!cachedIntersection) {
      const computedIntersection = await computeFollowIntersection(
        userID1,
        userID2
      );

      // Set newly-computed intersection to cache
      const cacheResult = await storeFollowIntersection(
        userID1,
        userID2,
        computedIntersection
      );
      if (!cacheResult) {
        throw `failed to cache intersection count: ${computedIntersection}`;
      } else {
        intersectionCount = cacheResult.intersection_count;
        console.log("cache MISS");
      }
    }

    return {
      status: "success",
      intersectionCount,
    };
  } catch (err) {
    return { status: "error", message: err };
  }
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

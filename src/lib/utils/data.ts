import { supabase } from "../supabaseClient";
import { RedisClientType } from "redis";
import { getUserSession } from "./auth";
import { getCurrentTimestamp } from "./general";
import { z } from "zod";

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
  count: number = 25,
  filters: SearcherProfilesFilterType = {}
) {
  console.log("startIdx: ", startIdx, " count: ", count);
  const { leaseLength, housemateCount, movingTime } = filters;
  let query = supabase
    .from("housing_search_profiles")
    .select(
      `
      *, user:users(name, twitter_handle, twitter_avatar_url)
    `
    )
    .range(startIdx, startIdx + count - 1)
    .order("last_updated_date", { ascending: false });

  if (leaseLength) {
    query = query.eq("pref_housing_type", leaseLength);
  }
  if (housemateCount) {
    query = query.eq("pref_housemate_count", housemateCount);
  }
  if (movingTime) {
    query = query.eq("pref_move_in", movingTime);
  }

  const { data, error } = await query;
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

export async function getCommunities(startIdx: number = 0, count: number = 25) {
  const { data, error } = await supabase.from("communities").select(
    `
      *, user:users(name, twitter_handle, twitter_avatar_url)
    `
  );
  // .range(startIdx, startIdx + count);

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getUserHousingSearchProfile(userID: string) {
  const { data, error } = await supabase
    .from("housing_search_profiles")
    .select("*")
    .eq("user_id", userID)
    .maybeSingle();

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function saveUserHousingSearchProfile(profileData: {
  link: string;
  pref_housemate_count: string;
  pref_housemate_details: string;
  pref_housing_type: string;
  pref_move_in: string;
  user_id: string;
}) {
  const dbSchema = z.object({
    pref_housemate_details: z.coerce.string(),
    pref_housing_type: z.coerce.number(),
    pref_move_in: z.coerce.number(),
    pref_housemate_count: z.coerce.number(),
    link: z.coerce.string(),
    user_id: z.coerce.string().uuid(),
    last_updated_date: z.coerce.string(),
    contact_phone: z.coerce.string(),
    contact_email: z.coerce.string(),
  });

  const { data, error } = await supabase
    .from("housing_search_profiles")
    .upsert(
      dbSchema.parse({
        ...profileData,
        last_updated_date: getCurrentTimestamp(),
      })
    )
    .select();

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function confirmHousingSearchProfileActive(user_id: string) {
  return await supabase
    .from("housing_search_profiles")
    .upsert({ user_id, last_updated_date: getCurrentTimestamp() })
    .select();
}

export async function deleteUserHousingSearchProfile(userID: string) {
  const { error } = await supabase
    .from("housing_search_profiles")
    .delete()
    .eq("user_id", userID);

  if (error) {
    console.error(error);
    return { status: "error" };
  } else {
    return { status: "success" };
  }
}

// ----- Referrals -----

// export async function genReferral(userID: string) {
//   // Postgres RLS to ensure:
//   // 1. Originator_id matches authenticated users's ID
//   // 2. User has remaining referrals before executing query
//   const { data, error } = await supabase
//     .from("referrals")
//     .insert([{ originator_id: userID }]);

//   if (error) {
//     console.error(error);
//   } else {
//     const availableReferrals = await decAvailableReferrals(userID);
//     return [data, availableReferrals];
//   }
// }

export async function getReferrerName(userId: string) {
  const { data: referralData, error: referralError } = await supabase
    .from("referral_recipients")
    .select("referral_id")
    .eq("recipient_id", userId);

  if (referralError || !referralData || referralData.length === 0) {
    return;
    throw new Error("No referral data found for this user");
  }

  const referralCode = referralData[0].referral_id;

  const { data: referralInfo, error: referralInfoError } = await supabase
    .from("referrals")
    .select("originator_id")
    .eq("referral_id", referralCode);

  if (referralInfoError || !referralInfo || referralInfo.length === 0) {
    return;
    throw new Error("No referral data found for this user");
  }

  const originatorId = referralInfo[0].originator_id;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("name, twitter_handle, twitter_avatar_url")
    .eq("user_id", originatorId);

  if (userError || !userData || userData.length === 0) {
    throw new Error("No user found with this ID");
  }

  return {
    name: userData[0].name,
    twitter_handle: userData[0].twitter_handle,
    twitter_avatar_url: userData[0].twitter_avatar_url,
  };
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
  } else if (
    data.usage_count &&
    data.usage_limit &&
    data.usage_count >= data.usage_limit
  ) {
    status = "claimed";
  } else {
    status = "unclaimed";
  }

  return {
    referralCreatedAt: data?.created_at,
    originatorID: data?.originator_id,
    referralID: data?.referral_id,
    // @ts-ignore
    originatorName: data?.originator.name,
    status,
  };
}

export async function claimReferral(referralID: string, userID: string) {
  // Fetch the current referral record
  const { data: referralData, error: referralError } = await supabase
    .from("referrals")
    .select("usage_count, usage_limit")
    .eq("referral_id", Number(referralID));

  // If there was an error fetching the referral record, return an error message
  if (referralError || !referralData || referralData.length === 0) {
    return {
      status: "error",
      message: "failed to claim referral: invalid referral code",
    };
  }

  const referral = referralData[0];

  // Check if the usage_count is less than the usage_limit
  if ((referral.usage_count ?? 0) < (referral.usage_limit ?? 0)) {
    // If it is less than usage_limit, then add 1 to the current usage count
    const { data, error: updateError } = await supabase
      .from("referrals")
      .update({ usage_count: (referral.usage_count ?? 0) + 1 })
      .eq("referral_id", Number(referralID))
      .select("*");

    // If there was an error updating the referral record or no rows were affected, return an error message
    if (updateError || !data || data.length === 0) {
      return { status: "error", message: "Failed to claim referral" };
    }

    // Add row to referral_recipients table
    const { data: insertData, error: insertError } = await supabase
      .from("referral_recipients")
      .insert([{ referral_id: Number(referralID), recipient_id: userID }])
      .select("*");

    // If there was an error inserting the record, log it and return an error message
    if (insertError) {
      console.error("Insert error:", insertError);
      return { status: "error", message: "failed to record the claim" };
    }

    // If no rows were affected, return an error message
    if (!insertData || insertData.length === 0) {
      return {
        status: "error",
        message: "failed to record the claim - no rows affected",
      };
    }

    return { status: "success" };
  } else {
    // If usage_count is === to usage_limit, then return status: error and message" failed to claim referral
    return {
      status: "error",
      message: "failed to claim referral: referral limit reached",
    };
  }
}

// async function decAvailableReferrals(userID: string) {
//   // Postgres RLS to ensure:
//   // 1. user_id matches authenticated users's ID

//   const { data, error } = await supabase
//     .rpc("decrement_available_referrals")
//     .eq("user_id", userID);
//   if (error) {
//     console.error(error);
//   } else {
//     return data;
//   }
// }

// export async function getAvailableReferrals(userID: string) {
//   // Postgres RLS to ensure:
//   // 1. user_id matches authenticated users's ID

//   let { data, error } = await supabase
//     .from("users")
//     .select("available_referrals")
//     .eq("user_id", userID);
// }

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
    const body = await response.json();
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
    } else if (
      !cachedIntersection ||
      cachedIntersection.intersection_count === null
    ) {
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
    throw new Error(`HTTP ${response.status}: Network response was not ok`);
  }
  return response;
}

export const twitter = {
  following: {
    getFromTwitter: async (twitterID: string) => {
      const twEndpoint = `https://api.twitter.com/2/users/${twitterID}/following`;
      let cursor = null;
      let following: User[] = [];
      try {
        do {
          const res = await fetchFromTwitter(
            `${twEndpoint}${cursor ? `?pagination_token=${cursor}` : ""}`
          );
          const data = await res.json();
          if (data.data) {
            following = [...following, ...data.data];
            cursor = data.meta.next_token;
          }
        } while (cursor);
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("Rate limit reached")
        ) {
          console.error(
            "Rate limit reached for following. Returning what we have so far."
          );
        } else {
          throw err;
        }
      }
      return following;
    },
    setToStore: storeFollowing,
  },
  followers: {
    getFromTwitter: async (twitterID: string) => {
      const twEndpoint = `https://api.twitter.com/2/users/${twitterID}/followers`;
      let cursor: string | null = null;
      let followers: User[] = [];
      try {
        do {
          const res = await fetchFromTwitter(
            `${twEndpoint}${cursor ? `?pagination_token=${cursor}` : ""}`
          );
          const data = await res.json();
          if (data.data) {
            followers = [...followers, ...data.data];
            cursor = data.meta.next_token;
          }
        } while (cursor);
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("Rate limit reached")
        ) {
          console.error(
            "Rate limit reached for followers. Returning what we have so far."
          );
        } else {
          throw err;
        }
      }
      return followers;
    },
    setToStore: storeFollowers,
  },
  followIntersection: {
    compute: async () => {},
    setToStore: async () => {},
  },
};

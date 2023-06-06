import { supabase } from "../supabaseClient";
import { RedisClientType } from "redis";

// ----- Users & Profiles -----

export async function createUser(
  newUser: Database["public"]["Tables"]["users"]["Insert"]
) {
  const { error } = await supabase.from("users").insert(newUser);
  if (error) {
    console.error(error);
    return error;
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

export async function storeFollows(
  redisClient: RedisClientType,
  userID: string,
  follows: Array<string>
) {
  if (!redisClient) {
    console.error("Failed to create Redis client");
  } else {
    const redisKey = `user-follows:${userID}`;
    return await redisClient.SADD(redisKey, follows);
  }
}

export async function storeFollowers(
  redisClient: RedisClientType,
  userID: string,
  followers: Array<string>
) {
  if (!redisClient) {
    console.error("Failed to create Redis client");
  } else {
    const redisKey = `user-followers:${userID}`;
    return await redisClient.SADD(redisKey, followers);
  }
}

export async function getFollowIntersection(
  redisClient: RedisClientType,
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

export const twitter = {
  follows: {
    getFromTwitter: async () => {},
    setToStore: async () => {},
  },
  followers: {
    getFromTwitter: async () => {},
    setToStore: async () => {},
  },
  followIntersection: {
    compute: async () => {},
    setToStore: async () => {},
  },
};

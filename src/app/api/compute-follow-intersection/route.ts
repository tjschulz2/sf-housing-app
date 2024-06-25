import { NextResponse } from "next/server";
import redisClient from "../../../lib/redisClient";
import { headers } from "next/headers";
import { RedisClientType } from "redis";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchIntersectionFromSupabase(userID1: string, userID2: string) {
  const { data, error } = await supabase
    .from("follow_intersections")
    .select("intersection_count")
    .eq("user_1_id", userID1)
    .eq("user_2_id", userID2)
    .single();

  if (error) {
    console.error("Error fetching intersection from Supabase:", error);
    return null;
  }

  return data ? data.intersection_count : null;
}

async function computeFollowIntersectionServerSide(
  redisClient: RedisClientType<any, any, any>,
  userID1: string,
  userID2: string
) {
  const user1FollowsKey = `${userID1}_following`;
  const user2FollowersKey = `${userID2}_followers`;

  // Fetch the following and followers lists from Redis
  const user1Following = await redisClient.sMembers(user1FollowsKey);
  const user2Followers = await redisClient.sMembers(user2FollowersKey);

  console.log("user1Following", user1Following);
  console.log("user2Followers", user2Followers);

  // Compute the intersection
  const intersectionIDs = user1Following.filter((id) =>
    user2Followers.includes(id)
  );

  return intersectionIDs.length;
}

async function storeIntersectionInSupabase(
  userID1: string,
  userID2: string,
  intersectionCount: number
) {
  const { data, error } = await supabase.from("follow_intersections").upsert([
    {
      user_1_id: userID1,
      user_2_id: userID2,
      intersection_count: intersectionCount,
    },
  ]);

  if (error) {
    console.error("Error storing intersection in Supabase:", error);
  } else {
    console.log("Stored intersection in Supabase:", data);
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const reqBody = await request.json();
    const { userID1, userID2 }: { userID1: string; userID2: string } =
      reqBody;

    if (!userID1 || !userID2) {
      throw "Missing one or more userIDs";
    }

    // Step 1: Check if existing pairs are in Supabase
    // const existingCount = await fetchIntersectionFromSupabase(
    //   userID1,
    //   userID2
    // );

    // if (existingCount !== null) {
    //   console.log("got it from supabase");
    //   return NextResponse.json(
    //     { message: "success", count: existingCount },
    //     { status: 200 }
    //   );
    // }

    // Step 2: Find the intersection count in Redis
    const intersectionCount = await computeFollowIntersectionServerSide(
      redisClient,
      userID1,
      userID2
    );

    // Step 3: Store the result in Supabase
    // await storeIntersectionInSupabase(userID1, userID2, intersectionCount);

    console.log("got it from redis");
    return NextResponse.json(
      { message: "success", count: intersectionCount },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "server error", details: err },
      { status: 500 }
    );
  }
}

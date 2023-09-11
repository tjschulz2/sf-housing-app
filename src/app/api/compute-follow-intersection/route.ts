import { NextResponse } from "next/server";
import { createRedisClient } from "../../../lib/redisClient";
import { verify } from "jsonwebtoken";
import { headers } from "next/headers";
import { User } from "@supabase/supabase-js";
import { JwtPayload } from "jsonwebtoken";
import { RedisClientType } from "redis";

async function computeFollowIntersectionServerSide(
  redisClient: RedisClientType<any, any, any>,
  userID1: string,
  userID2: string
) {
  // Server-only
  // Computes and retrieves intersection between {user1 following} and {user2 followers}
  const user1FollowsKey = `user-following:${userID1}`;
  const user2FollowersKey = `user-followers:${userID2}`;
  const followIntersectionKey = `follow-intersection:${userID1}:${userID2}`;
  const count = await redisClient.sInterStore(followIntersectionKey, [
    user1FollowsKey,
    user2FollowersKey,
  ]);
  await redisClient.del(followIntersectionKey);
  return count;
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const reqBody = await request.json();
    const { userID1, userID2 }: { userID1: string; userID2: string } = reqBody;

    // verify jwt in request body OR use supabase next auth middleware
    const jwt = headersList.get("accessToken");
    if (!jwt) {
      throw "missing header: accessToken";
    }
    const user = verify(jwt, process.env.SUPABASE_JWT_SECRET) as User &
      JwtPayload;
    const { sub: jwtUserID } = user;

    if (!userID1 || !userID2) {
      throw "Missing one or more userIDs";
    }

    if (userID1 !== jwtUserID) {
      throw "Mismatch between JWT and userID1";
    }

    const redisClient = await createRedisClient();
    if (!redisClient) {
      throw "server error - no redis client";
    }

    const intersectionCount = await computeFollowIntersectionServerSide(
      redisClient,
      userID1,
      userID2
    );

    redisClient.quit();

    return NextResponse.json(
      { message: "success", intersectionCount },
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

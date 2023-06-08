import { NextResponse } from "next/server";
import { storeFollowing, storeFollowers } from "../../../../lib/utils/data";
import { createRedisClient } from "../../../../lib/redisClient";
import { verify } from "jsonwebtoken";
import { twitter } from "../../../../lib/utils/data";
import { headers } from "next/headers";
import { User } from "@supabase/supabase-js";
import { JwtPayload } from "jsonwebtoken";

export async function GET() {
  const headersList = headers();
  // verify jwt from req header OR use supabase next auth middleware
  try {
    const jwt = headersList.get("accessToken");
    if (!jwt) {
      throw "missing header: accessToken";
    }

    const user = verify(jwt, process.env.SUPABASE_JWT_SECRET) as User &
      JwtPayload;
    const { sub: userID } = user;

    const { sub: twitterID } = user.user_metadata;
    console.log(twitterID);
    if (userID && typeof userID === "string") {
      // Retrieve twitter follow data
      const userFollowing = (
        await twitter.following.getFromTwitter(twitterID)
      ).map((twUser) => twUser.id.toString());

      const userFollowers = (
        await twitter.followers.getFromTwitter(twitterID)
      ).map((twUser) => twUser.id.toString());

      const redisClient = await createRedisClient();
      if (!redisClient) {
        throw "server error - no redis client";
      }

      const followingStorageResult = await twitter.following.setToStore(
        redisClient,
        userID,
        userFollowing
      );
      const followerStorageResult = await twitter.followers.setToStore(
        redisClient,
        userID,
        userFollowers
      );

      console.log(followingStorageResult, followerStorageResult);
      redisClient.quit();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: `error: ${JSON.stringify(err)}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ msg: "success" }, { status: 200 });
}

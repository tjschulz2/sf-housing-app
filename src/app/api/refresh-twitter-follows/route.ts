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
  try {
    const jwt = headersList.get("accessToken");
    if (!jwt) {
      throw "missing header: accessToken";
    }

    const user = verify(jwt, process.env.SUPABASE_JWT_SECRET) as User &
      JwtPayload;
    const { sub: userID } = user;
    const { sub: twitterID } = user.user_metadata;

    if (userID && typeof userID === "string") {
      const followingList = (
        await twitter.following.getFromTwitter(twitterID)
      ).map((user) => user.id.toString());

      const followersList = (
        await twitter.followers.getFromTwitter(twitterID)
      ).map((user) => user.id.toString());

      const redisClient = await createRedisClient();
      if (!redisClient) {
        throw "server error - no redis client";
      }

      const followingStorageResult = await twitter.following.setToStore(
        redisClient,
        userID,
        followingList
      );
      const followerStorageResult = await twitter.followers.setToStore(
        redisClient,
        userID,
        followersList
      );

      if (
        followingStorageResult.status === "error" ||
        followerStorageResult.status === "error"
      ) {
        throw "Failed to store follow data";
      }

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

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
      const followingListPromise = twitter.following.getFromTwitter(twitterID);
      const followersListPromise = twitter.followers.getFromTwitter(twitterID);

      const [followingListResponse, followersListResponse] = await Promise.all([
        followingListPromise,
        followersListPromise,
      ]);

      const followingList = followingListResponse.map((user) =>
        user.id.toString()
      );
      const followersList = followersListResponse.map((user) =>
        user.id.toString()
      );

      const redisClient = await createRedisClient();
      if (!redisClient) {
        throw "server error - no redis client";
      }

      const followingStoragePromise = twitter.following.setToStore(
        redisClient,
        userID,
        followingList
      );
      const followersStoragePromise = twitter.followers.setToStore(
        redisClient,
        userID,
        followersList
      );

      const [followingStorageResult, followersStorageResult] =
        await Promise.all([followingStoragePromise, followersStoragePromise]);

      redisClient.quit();

      if (
        followingStorageResult.status === "error" ||
        followersStorageResult.status === "error"
      ) {
        throw "Failed to store follow data";
      }
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

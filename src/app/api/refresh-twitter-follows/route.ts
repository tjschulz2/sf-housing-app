import { NextResponse } from "next/server";
import { storeFollowing, storeFollowers } from "../../../lib/utils/data";
import { createRedisClient } from "../../../lib/redisClient";
import { verify } from "jsonwebtoken";
import { twitter } from "../../../lib/utils/data";
import { headers } from "next/headers";
import { User } from "@supabase/supabase-js";
import { JwtPayload } from "jsonwebtoken";

export async function GET() {
  const headersList = headers();
  try {
    const headersList = headers();
    const jwt = headersList.get("accessToken");
    if (!jwt) {
      throw new Error("Missing header: accessToken");
    }

    const user = verify(jwt, process.env.SUPABASE_JWT_SECRET) as User &
      JwtPayload;
    const { sub: userID } = user;
    const { sub: twitterID } = user.user_metadata;

    if (userID && typeof userID === "string") {
      const followingPromise = twitter.following
        .getFromTwitter(twitterID)
        .catch((err) => {
          throw `Error in followingPromise: ${err}`;
        });
      const followersPromise = twitter.followers
        .getFromTwitter(twitterID)
        .catch((err) => {
          throw `Error in followersPromise: ${err}`;
        });

      const [followingResponse, followersResponse] = await Promise.all([
        followingPromise,
        followersPromise,
      ]);

      const followingList = followingResponse.map((user) => user.id.toString());
      const followersList = followersResponse.map((user) => user.id.toString());

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
    if (err instanceof Error && err.message.includes("Rate limit reached")) {
      return NextResponse.json(
        { message: "Rate limit reached. Try again later." },
        { status: 429 }
      );
    } else {
      return NextResponse.json(
        { message: `Unexpected server error: ${err}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}

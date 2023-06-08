import { NextResponse } from "next/server";
import { storeFollowing, storeFollowers } from "../../../../lib/utils/data";
import { createRedisClient } from "../../../../lib/redisClient";
import { verify } from "jsonwebtoken";
import { twitter } from "../../../../lib/utils/data";
import { headers } from "next/headers";
import { User, Session } from "@supabase/supabase-js";
import { JwtPayload } from "jsonwebtoken";

// const test: JwtPayload = {
//   aud: "authenticated",
//   exp: 1686111097,
//   sub: "ca8c6a77-dc5b-4372-b0ee-f963ef799c9c",
//   email: "neall.seth@gmail.com",
//   phone: "",
//   app_metadata: { provider: "twitter", providers: ["twitter"] },
//   user_metadata: {
//     avatar_url:
//       "https://pbs.twimg.com/profile_images/1473511833038471170/b-kaPhhd_normal.jpg",
//     email: "neall.seth@gmail.com",
//     email_verified: true,
//     full_name: "Neall",
//     iss: "https://api.twitter.com/1.1/account/verify_credentials.json",
//     name: "Neall",
//     picture:
//       "https://pbs.twimg.com/profile_images/1473511833038471170/b-kaPhhd_normal.jpg",
//     preferred_username: "neallseth",
//     provider_id: "245221913",
//     sub: "245221913",
//     user_name: "neallseth",
//   },
//   role: "authenticated",
//   aal: "aal1",
//   amr: [{ method: "oauth", timestamp: 1686011588 }],
//   session_id: "9b79a8c5-3c5f-4078-a7b8-afcf28cc3cb4",
// };

export async function GET() {
  const headersList = headers();
  // verify jwt from req header OR use supabase next auth middleware
  try {
    const jwt = headersList.get("accessToken");
    if (!jwt) {
      throw "missing header: accessToken";
    }

    const user = verify(jwt, process.env.SUPABASE_JWT_SECRET);
    console.log(user);
    const { sub: userID } = user;

    const { sub: twitterID } = user.user_metadata;
    console.log(twitterID);
    if (userID && typeof userID === "string") {
      // Retrieve twitter follow data
      const userFollowing = (
        await twitter.following.getFromTwitter(twitterID)
      ).map((twUser) => twUser.username);

      console.log(userFollowing);
      const userFollowers = ["b", "c", "d"];

      const redisClient = await createRedisClient();
      if (!redisClient) {
        throw "server error - no redis client";
      }

      const followingStorageResult = await storeFollowing(
        redisClient,
        userID,
        userFollowing
      );
      const followerStorageResult = await storeFollowers(
        redisClient,
        userID,
        userFollowers
      );
      console.log(followingStorageResult, followerStorageResult);
      redisClient.quit();
    }
  } catch (err) {
    console.error(err);
    return new Response(`server error: ${JSON.stringify(err)}`, {
      status: 500,
    });
  }

  return NextResponse.json({ msg: "success" });
}

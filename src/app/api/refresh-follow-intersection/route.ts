import { NextResponse } from "next/server";
import { createRedisClient } from "../../../../lib/redisClient";
import { verify } from "jsonwebtoken";
import { twitter } from "../../../../lib/utils/data";
import { headers } from "next/headers";
import { getFollowIntersection } from "../../../../lib/utils/data";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(request: Request) {
  const headersList = headers();
  const reqBody = await request.json();
  const { targetUserID }: { targetUserID: string } = reqBody;
  // verify jwt in request body OR use supabase next auth middleware
  try {
    const jwt = headersList.get("accessToken");
    if (!jwt) {
      throw "missing header: accessToken";
    }
    const user = verify(jwt, process.env.SUPABASE_JWT_SECRET);
    console.log(user);
    const { sub: userID } = user;

    const redisClient = await createRedisClient();
    if (!redisClient) {
      throw "server error - no redis client";
    }

    const intersectionCount = await getFollowIntersection(
      redisClient,
      userID,
      targetUserID
    );
    const { data, error } = await supabase
      .from("follow_intersections")
      .upsert({ intersection_count: intersectionCount })
      .eq("user_1_id", userID)
      .eq("user_2_id", targetUserID)
      .select();

    redisClient.quit();

    if (error) {
      throw "error: failed to store follow intersection in db";
    } else {
      return NextResponse.json({
        msg: "success",
        intersectionCount: data,
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(`server error: ${JSON.stringify(err)}`, {
      status: 500,
    });
  }
}

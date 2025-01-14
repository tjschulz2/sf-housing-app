import { NextResponse } from "next/server";
import { createRedisClient } from "../../../lib/redisClient";
import { headers } from "next/headers";
import { RedisClientType } from "redis";

async function computeFollowIntersectionServerSide(
    redisClient: RedisClientType<any, any, any>,
    userID1: string,
    userID2: string
) {
    // Computes and retrieves intersection between {user1 following} and {user2 followers}
    const user1FollowsKey = `user-following:${userID1}`;
    const user2FollowersKey = `user-followers:${userID2}`;

    // const user1FollowsKey = `${userID1}_following`;
    // const user2FollowersKey = `${userID2}_followers`;
    const intersectionIDs = await redisClient.sInter([
        user1FollowsKey,
        user2FollowersKey,
    ]);

    const intersectionCount = intersectionIDs.length;
    return intersectionCount

    // // Assuming intersectionIDs are just IDs, convert them to detailed follower data
    // const intersectionDetails = await Promise.all(
    //     intersectionIDs.map(async (id: string) => {
    //         const screen_name = await redisClient.hGet(
    //             `user:${id}`,
    //             "screen_name"
    //         );
    //         const profile_image_url = await redisClient.hGet(
    //             `user:${id}`,
    //             "profile_image_url"
    //         );
    //         return { screen_name, profile_image_url };
    //     })
    // );

    // return intersectionDetails;
}

export async function POST(request: Request) {
    try {
        console.log("got here");
        const headersList = await headers();
        const reqBody = await request.json();
        const { userID1, userID2 }: { userID1: string; userID2: string } =
            reqBody;

        if (!userID1 || !userID2) {
            console.log("failing here 51");
            throw "Missing one or more userIDs";
        }

        const redisClient = await createRedisClient();
        if (!redisClient) {
            console.log("failing here 57");
            throw "server error - no redis client";
        }

        const intersectionCount = await computeFollowIntersectionServerSide(
            redisClient,
            userID1,
            userID2
        );
        // const intersectionCount = intersectionDetails.filter(
        //     (detail) => detail.screen_name
        // ).length;

        redisClient.quit();

        // if (intersectionCount === 0) {
        //     console.log("failing here 71");
        //     return NextResponse.json(
        //         {
        //             message: "No data available",
        //             // intersectionDetails: [],
        //             count: 0,
        //         },
        //         { status: 404 }
        //     );
        // }

        return NextResponse.json(
            {
                message: "success",
                // intersectionDetails,
                count: intersectionCount,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("failing here 93");
        console.error(err);
        return NextResponse.json(
            { message: "server error", details: err },
            { status: 500 }
        );
    }
}

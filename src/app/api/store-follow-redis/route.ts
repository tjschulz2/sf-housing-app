import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const redisUrl = process.env.REDIS_URL as string;

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN as string;
const socialDataApiKey = process.env.SOCIALDATA_API_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);
const redisClient = new Redis(redisUrl);

async function getFollowers(
    userId: string,
    apiKey: string,
    cursor?: string
): Promise<any> {
    const url = "https://api.socialdata.tools/twitter/followers/list";
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
    };
    const params = new URLSearchParams({
        user_id: userId,
        count: "200",
    });
    if (cursor) {
        params.append("cursor", cursor);
    }

    const response = await fetch(`${url}?${params}`, { headers });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
}

async function getFollowing(
    userId: string,
    apiKey: string,
    cursor?: string
): Promise<any> {
    const url = "https://api.socialdata.tools/twitter/friends/list";
    const headers = {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
    };
    const params = new URLSearchParams({
        user_id: userId,
        count: "200",
    });
    if (cursor) {
        params.append("cursor", cursor);
    }

    const response = await fetch(`${url}?${params}`, { headers });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
}

async function getAllFollowers(userId: string, apiKey: string): Promise<any[]> {
    let allFollowers: any[] = [];
    let cursor: string | undefined = undefined;
    let count = 0;

    while (count < 5000) {
        const followersData = await getFollowers(userId, apiKey, cursor);
        allFollowers = allFollowers.concat(followersData.users);
        cursor = followersData.next_cursor;
        count += followersData.users.length;
        console.log(`Fetched ${count} followers so far...`);
        if (!cursor || cursor === "0") break;
    }

    return allFollowers;
}

async function getAllFollowing(userId: string, apiKey: string): Promise<any[]> {
    let allFollowing: any[] = [];
    let cursor: string | undefined = undefined;
    let count = 0;

    while (count < 5000) {
        const followingData = await getFollowing(userId, apiKey, cursor);
        allFollowing = allFollowing.concat(followingData.users);
        cursor = followingData.next_cursor;
        count += followingData.users.length;
        console.log(`Fetched ${count} following so far...`);
        if (!cursor || cursor === "0") break;
    }

    return allFollowing;
}

async function storeInRedis(
    uuid: string,
    followers: any[],
    following: any[]
): Promise<void> {
    // Store followers
    for (const follower of followers) {
        await redisClient.sadd(`user-followers:${uuid}`, follower.id_str);
    }

    // Store following
    for (const follow of following) {
        await redisClient.sadd(`user-following:${uuid}`, follow.id_str);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { twitterID, uuid } = await req.json();

        if (!twitterID || !uuid) {
            return NextResponse.json(
                { message: "Missing twitterID or uuid" },
                { status: 400 }
            );
        }

        console.log(
            `Starting to fetch data for UUID: ${uuid} and TwitterID: ${twitterID}`
        );

        // Get all followers and following
        const followers = await getAllFollowers(twitterID, socialDataApiKey);
        console.log(`Fetched all followers for UUID: ${uuid}`);

        const following = await getAllFollowing(twitterID, socialDataApiKey);
        console.log(`Fetched all following for UUID: ${uuid}`);

        // Store the results in Redis using UUID
        await storeInRedis(uuid, followers, following);

        console.log(`Stored data for UUID: ${uuid}`);

        // Update Supabase to indicate data has been pulled
        const { error } = await supabase
            .from("twitter_followers_added")
            .upsert([{ user_id: uuid }], { onConflict: "user_id" });

        if (error) {
            console.error("Error updating Supabase:", error);
            throw new Error("Failed to update data");
        }

        return NextResponse.json(
            { message: "Data stored successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error", error: (error as Error).message },
            { status: 500 }
        );
    }
}




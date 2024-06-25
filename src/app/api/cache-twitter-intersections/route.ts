import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const redisUrl = process.env.REDIS_URL as string;

const supabase = createClient(supabaseUrl, supabaseKey);
const redisClient = new Redis(redisUrl);

async function fetchNewUsers(): Promise<{ user_id: string, twitter_id: string }[]> {
  const fetchNewUsersResponse = await fetch('http://localhost:3000/api/fetch-new-users');
  if (!fetchNewUsersResponse.ok) {
    throw new Error(`Failed to fetch new users: ${fetchNewUsersResponse.statusText}`);
  }
  const data: { users: { user_id: string, twitter_id: string }[] } = await fetchNewUsersResponse.json();
  return data.users;
}

async function storeTwitterData(twitterID: string, uuid: string): Promise<void> {
  try {
    console.log(`Starting to fetch data for UUID: ${uuid} and TwitterID: ${twitterID}`);
    await fetch('http://localhost:3000/api/store-twitter-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ twitterID, uuid }),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to store Twitter data for user ${uuid}: ${error.message}`);
    } else {
      console.error(`Failed to store Twitter data for user ${uuid}: ${error}`);
    }
    throw error;
  }
}

async function computeFollowIntersection(userID1: string, userID2: string) {
  const user1FollowsKey = `user-following:${userID1}`;
  const user2FollowersKey = `user-followers:${userID2}`;
  const intersectionIDs = await redisClient.sinter(user1FollowsKey, user2FollowersKey);

  const intersectionDetails = await Promise.all(
    intersectionIDs.map(async (id) => {
      const screen_name = await redisClient.hget(`user:${id}`, 'screen_name');
      const profile_image_url = await redisClient.hget(`user:${id}`, 'profile_image_url');
      return { screen_name, profile_image_url };
    })
  );

  const intersectionKey = `intersection:${userID1}:${userID2}`;
  for (const detail of intersectionDetails) {
    await redisClient.sadd(intersectionKey, JSON.stringify(detail));
  }
}

async function cacheIntersectionsForUser(userID: string, twitterID: string) {
  const users = await fetchNewUsers();
  for (const user of users) {
    if (user.user_id !== userID) {
      await computeFollowIntersection(userID, user.user_id);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const users = await fetchNewUsers();
    for (const user of users) {
      const { user_id: uuid, twitter_id: twitterID } = user;
      if (!uuid || !twitterID) {
        console.log(`Missing uuid or twitter_id for user: ${JSON.stringify(user)}`);
        continue;
      }

      const isInRedis = await redisClient.exists(`user-followers:${uuid}`);
      if (!isInRedis) {
        await storeTwitterData(twitterID, uuid);
      }

      await cacheIntersectionsForUser(uuid, twitterID);
    }
    return NextResponse.json({ message: 'Twitter intersections cached successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Server error', error: 'Unknown error' }, { status: 500 });
    }
  }
}

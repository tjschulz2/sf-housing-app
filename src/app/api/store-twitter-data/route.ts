import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const redisClient = new Redis(process.env.REDIS_URL!);

interface TwitterUser { 
  id_str: string;
  screen_name: string;
  profile_image_url_https: string;
}

async function getAllFollowers(twitterID: string, apiKey: string): Promise<TwitterUser[]> {
  const followers: TwitterUser[] = [];
  let cursor = null;

  while (true) {
    const url = `https://api.socialdata.tools/twitter/followers/list?user_id=${twitterID}&count=200${cursor ? `&cursor=${cursor}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      followers.push(...data.users);
      cursor = data.next_cursor;
      if (!cursor || cursor === '0') break;
    } else {
      throw new Error(`Error fetching followers: ${response.statusText}`);
    }
  }
  return followers;
}

async function getAllFollowing(twitterID: string, apiKey: string): Promise<TwitterUser[]> {
  const following: TwitterUser[] = [];
  let cursor = null;

  while (true) {
    const url = `https://api.socialdata.tools/twitter/friends/list?user_id=${twitterID}&count=200${cursor ? `&cursor=${cursor}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      following.push(...data.users);
      cursor = data.next_cursor;
      if (!cursor || cursor === '0') break;
    } else {
      throw new Error(`Error fetching following: ${response.statusText}`);
    }
  }
  return following;
}

async function storeUserDetails(redisClient: Redis, userDetails: TwitterUser[]): Promise<void> {
  for (const user of userDetails) {
    const userID = user.id_str;
    await redisClient.hset(`user:${userID}`, {
      screen_name: user.screen_name,
      profile_image_url: user.profile_image_url_https
    });
  }
}

async function storeInRedis(redisClient: Redis, uuid: string, followers: TwitterUser[], following: TwitterUser[]): Promise<void> {
  for (const follower of followers) {
    await redisClient.sadd(`user-followers:${uuid}`, follower.id_str);
    await storeUserDetails(redisClient, [follower]);
  }

  for (const follow of following) {
    await redisClient.sadd(`user-following:${uuid}`, follow.id_str);
    await storeUserDetails(redisClient, [follow]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { twitterID, uuid } = await req.json();

    if (!twitterID || !uuid) {
      return NextResponse.json({ message: 'Missing twitterID or uuid' }, { status: 400 });
    }

    const apiKey = process.env.SOCIALDATA_API_KEY!;

    const followers = await getAllFollowers(twitterID, apiKey);
    const following = await getAllFollowing(twitterID, apiKey);

    await storeInRedis(redisClient, uuid, followers, following);

    return NextResponse.json({ message: 'Success' });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Unknown server error' }, { status: 500 });
    }
  }
}

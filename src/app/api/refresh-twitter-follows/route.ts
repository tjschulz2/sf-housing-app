import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const redisUrl = process.env.REDIS_URL!;

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_DEV!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV!;
// const redisUrl = process.env.REDIS_URL_DEV!;

const supabase = createClient(supabaseUrl, supabaseKey);
const redisClient = new Redis(redisUrl);

interface User {
  user_id: string;
  twitter_id: string;
}

async function fetchNewUsers(): Promise<User[]> {
  const fetchNewUsersResponse = await fetch('http://localhost:3000/api/fetch-new-users');
  if (!fetchNewUsersResponse.ok) {
    throw new Error(`Failed to fetch new users: ${fetchNewUsersResponse.statusText}`);
  }
  const data = await fetchNewUsersResponse.json() as { users: User[] };
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
      console.error(`Failed to store Twitter data for user ${uuid}: ${String(error)}`);
    }
    throw error;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const users = await fetchNewUsers();
    for (const user of users) {
      const { user_id: uuid, twitter_id: twitterID } = user;
      if (!uuid || !twitterID) {
        console.log(`Missing uuid or twitter_id for user: ${JSON.stringify(user)}`);
        continue;
      }
      // Check if user data already exists in Redis
      const isInRedis = await redisClient.exists(`user-followers:${uuid}`);
      if (isInRedis) {
        console.log(`Data for UUID: ${uuid} already exists in Redis, skipping.`);
        continue;
      }
      // Store Twitter data in Redis
      await storeTwitterData(twitterID, uuid);
    }
    return NextResponse.json({ message: 'Data refresh completed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ message: 'Server error', error: error.message });
    } else {
      return NextResponse.json({ message: 'Server error', error: 'Unknown error' });
    }
  }
}

export const GET = POST;
export const PUT = POST;
export const DELETE = POST;

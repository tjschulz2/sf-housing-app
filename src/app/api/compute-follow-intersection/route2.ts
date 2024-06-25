import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import { NextResponse } from 'next/server';

const redisUrl = process.env.REDIS_URL as string;
const redisClient = new Redis(redisUrl);

async function fetchFollowersFromRedis(userId: string): Promise<Set<string>> {
  const followers = await redisClient.smembers(`user-followers:${userId}`);
  return new Set(followers);
}

async function computeIntersection(userID1: string, userID2: string): Promise<string[]> {
  const followers1 = await fetchFollowersFromRedis(userID1);
  const followers2 = await fetchFollowersFromRedis(userID2);

  const intersection = [...followers1].filter(follower => followers2.has(follower));
  return intersection;
}

export async function POST(req: Request) {
  try {
    const { userID1, userID2 } = await req.json();

    if (!userID1 || !userID2) {
      return NextResponse.json({ message: 'Missing userID1 or userID2' }, { status: 400 });
    }

    console.log(`Computing intersection for UserIDs: ${userID1} and ${userID2}`);

    const intersection = await computeIntersection(userID1, userID2);

    return NextResponse.json({ intersectionDetails: intersection }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}

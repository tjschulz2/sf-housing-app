import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { NextRequest } from 'next/server';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

async function checkRedisData(uuid: string): Promise<boolean> {
  const followersKey = `user-followers:${uuid}`;
  const followingKey = `user-following:${uuid}`;

  const followersExist = await redisClient.exists(followersKey);
  const followingExist = await redisClient.exists(followingKey);

  return followersExist > 0 && followingExist > 0;
}

export async function POST(req: NextRequest) {
  try {
    const { uuid } = await req.json();
    
    if (!uuid) {
      return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
    }

    const exists = await checkRedisData(uuid);

    if (exists) {
      return NextResponse.json({ message: `Data exists for UUID: ${uuid}` });
    } else {
      return NextResponse.json({ message: `No data found for UUID: ${uuid}` });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}

export const GET = POST;
export const PUT = POST;
export const DELETE = POST;

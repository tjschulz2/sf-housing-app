import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import redisClient from '@/lib/redisClient'; // Adjust the import based on your file structure

async function checkRedisData(uuid: string): Promise<boolean> {
  const followersKey = `${uuid}_followers`;
  const followingKey = `${uuid}_following`;

  const followersExist = await redisClient.exists(followersKey);
  const followingExist = await redisClient.exists(followingKey);

  return followersExist > 0 && followingExist > 0;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  return Promise.race([promise, timeout]);
}

export async function POST(req: NextRequest) {
  try {
    const { uuid } = await req.json();
    
    if (!uuid) {
      return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
    }

    const exists = await withTimeout(checkRedisData(uuid), 30000); // Set timeout to 30 seconds

    if (exists) {
      return NextResponse.json({ message: `Data exists for UUID: ${uuid}` });
    } else {
      return NextResponse.json({ message: `No data found for UUID: ${uuid}` });
    }
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      if (error.message === 'Request timed out') {
        return NextResponse.json({ message: 'Request timed out' }, { status: 503 });
      }
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown server error' }, { status: 500 });
  }
}

export const GET = POST;
export const PUT = POST;
export const DELETE = POST;

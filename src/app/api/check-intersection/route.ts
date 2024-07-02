import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL);

export async function POST(req: NextRequest) {
  try {
    const { userID1, userID2 } = await req.json();

    if (!userID1 || !userID2) {
      return NextResponse.json({ message: "Missing userID1 or userID2" }, { status: 400 });
    }

    const key = `${userID1}_${userID2}_intersection`;
    const intersectionCount = await redis.get(key);

    if (intersectionCount === null) {
      return NextResponse.json({ message: "Intersection not found" }, { status: 404 });
    }

    return NextResponse.json({ count: parseInt(intersectionCount, 10) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching intersection count:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

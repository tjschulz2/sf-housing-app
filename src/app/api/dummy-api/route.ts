import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userID1, userID2 } = await req.json();

  if (!userID1 || !userID2) {
    return NextResponse.json({ message: "Missing userID1 or userID2" }, { status: 400 });
  }

  // Return a dummy count of 3
  return NextResponse.json({ count: 3 });
}

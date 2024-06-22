import { NextRequest, NextResponse } from 'next/server';
import { deleteSessionData } from '@/app/lib/redis';

// Endpoint '/api/logout' for logging the user out and deleting it's session data from Redis. Receives sessionId.
export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    const sessionDeleted = await deleteSessionData(data.sessionId); // Delete session data from Redis
    return NextResponse.json(sessionDeleted, { status: 200 });
  } catch (error) {
    console.log(`Error log: ${error}`);
    return NextResponse.json(error, { status: 500 });
  }
}

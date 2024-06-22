import { NextRequest, NextResponse } from 'next/server';
import { getSessionData } from '@/app/lib/redis';

// Endpoint 'api/authenticate' for checking the existence of current session in Redis by sessionId, which it receives
export async function POST(request: NextRequest) {
  const data = await request.json();
  let session;
  try {
    session = await getSessionData(data.sessionId);
    if (!session) return NextResponse.redirect(new URL('login', '/')); // if there is no session data in Redis, redirect to login page
  } catch (error) {
    console.log(`Error log: ${error}`);
    return NextResponse.json(error, { status: 500 });
  }
  return NextResponse.json(session, { status: 200 }); // if session data is found in Redis, return it
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import config from '../../config/config';
import { storeSessionData } from '@/app/lib/redis';
import { verifyPassword } from '@/app/lib/encrypt';

// Endpoint 'api/login' ,receives user data, checks that the user exists in Mongo DB, and then verifies it's password
export async function POST(request: NextRequest) {
  const data = await request.json();
  const client = await connectToDatabase(); // establish connection to MongoDB

  let userFound;
  const collection = client
    .db(config.db.mongoDBname)
    .collection(config.db.mongoDBcollection);
  try {
    userFound = await collection.find({ email: data.email }).toArray(); // find user in Mongo DB by the email (should be unique)
    if (userFound.length > 0) {
      // If the user is found, verify password
      const passwordsMatch = await verifyPassword(
        data.password,
        userFound[0].password
      );
      if (!passwordsMatch)
        return NextResponse.json('Invalid Password!', { status: 403 });
    } else return NextResponse.json('User Not Found', { status: 404 });

    // If user is found and password matches, store it's data in Redis session storage
    await storeSessionData(
      userFound[0]._id.toString(),
      { fullName: userFound[0].fullName, email: userFound[0].email },
      1800 // session data will expire in 20 min
    );
  } catch (error) {
    console.log(`Error log: ${error}`);

    throw error;
  } finally {
    client.close(); // close the MongoDB connection
  }

  return NextResponse.json(userFound, { status: 200 });
}

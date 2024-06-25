import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import config from '../../config/config';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import { io } from 'socket.io-client';

// Endpoint 'api/state' receives new state, gets user Session ID from Redis and updates the user's state in MongoDB
export async function POST(request: NextRequest) {
  const data = await request.json();
  const client = await connectToDatabase(); // establish connection to MongoDB
  const socket = io('http://localhost:80');
  socket.emit(
    'statusUpdated',
    JSON.stringify({
      id: data.sessionId,
      status: data.status,
      lastUpdated: moment().format(),
    })
  );
  let userUpdated;
  const collection = client
    .db(config.db.mongoDBname)
    .collection(config.db.mongoDBcollection);
  try {
    const userId = ObjectId.createFromHexString(data.sessionId);
    const lastUpd = moment().format();
    userUpdated = await collection.findOneAndUpdate(
      { _id: userId },
      { $set: { status: data.status, lastUpdated: lastUpd } }
    );
    if (userUpdated) {
      return NextResponse.json(userUpdated, { status: 200 });
    } else return NextResponse.json('User Not Updated', { status: 400 });
  } catch (error) {
    console.log(`Error log: ${error}`);
    return NextResponse.json(`Failed to update user: ${error}`, {
      status: 500,
    });
  } finally {
    client.close(); // close the MongoDB connection
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { MongoServerError } from 'mongodb';
import { connectToDatabase } from '@/app/lib/mongodb';
import config from '../../config/config';

// Endpoint 'api/signup' receives user data and saves it in MongoDB, in case it's a new user
export async function POST(request: NextRequest) {
  const data = await request.json();
  const client = await connectToDatabase(); // establish connection to MongoDB
  let insertResult;
  let userExists;
  const collection = client
    .db(config.db.mongoDBname)
    .collection(config.db.mongoDBcollection);
  try {
    userExists = await collection.find({ email: data.email }).toArray(); // Check that the user doesn't already exist
    insertResult =
      userExists.length === 0
        ? await collection.insertOne(data) // if user doesn't exist yet, insert it into the MongoDB
        : 'User already exists';
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Error log: ${error}`);
    }
    throw error;
  } finally {
    client.close();
  }
  let status;
  if (insertResult === 'User already exists') status = 400;
  else status = 201;
  return NextResponse.json(insertResult, { status: status });
}

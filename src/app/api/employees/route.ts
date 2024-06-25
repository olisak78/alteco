import config from '@/app/config/config';
import { connectToDatabase } from '@/app/lib/mongodb';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const size = searchParams.get('size');
  const client = await connectToDatabase(); // establish connection to MongoDB
  const collection = client
    .db(config.db.mongoDBname)
    .collection(config.db.mongoDBcollection);
  let returnedData;
  try {
    if (page && size && +page >= 0 && +size > 0)
      returnedData = await collection
        .aggregate([
          { $skip: +page * +size },
          { $limit: +size },
          {
            $project: {
              _id: 0,
              fullName: 1,
              email: 1,
              lastUpdated: 1,
              status: 1,
            },
          },
          { $sort: { lastUpdated: -1 } },
        ])
        .toArray();
    else
      return NextResponse.json('Bad Request: query params are invalid', {
        status: 500,
      });
  } catch (error) {
    console.log(`Error log: ${error}`);
    return NextResponse.json('Employees Not Found', { status: 404 });
  } finally {
    client.close(); // close the MongoDB connection
  }

  return NextResponse.json(returnedData, { status: 200 });
}

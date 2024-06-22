import { MongoClient } from 'mongodb';
import config from '../config/config';

const client = new MongoClient(config.db.mongoDBhost); // Create MongoDB connection client

export async function connectToDatabase() {
  try {
    await client.connect(); // connect to MongoDB
  } catch (error) {
    if (error) {
      console.log(`Error: ${error}`);
    }
    throw error;
  }
  console.log('Connected successfully to server');
  return Promise.resolve(client);
}

import Redis, { ClusterOptions, RedisOptions } from 'ioredis';
import config from '../config/config';

// Redis Configuration
const redisConfig: RedisOptions | ClusterOptions = {
  host: config.db.redisDBhost,
  port: +config.db.redisDBport,
  username: 'default',
  password: config.db.redisDBpassword,
  family: 4,
  db: 0,
  maxRetriesPerRequest: 1,
};

// Redis Client
const redisClient = new Redis(redisConfig);
// Error Handling
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Session Data Storage Function
export async function storeSessionData(
  userId: string,
  sessionData: any,
  expirationSeconds: number
): Promise<void> {
  try {
    const sessionKey = `session:${userId}`; // Unique key for each user's session
    const serializedData = JSON.stringify(sessionData);
    await redisClient.set(sessionKey, serializedData, 'EX', expirationSeconds); // Store with expiration time
  } catch (error) {
    console.error('Error storing session data in Redis:', error);
  }
}

//  Session Data Retrieval Function
export async function getSessionData(userId: string): Promise<any | null> {
  try {
    const sessionKey = `session:${userId}`;
    const serializedData = await redisClient.get(sessionKey);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error('Error retrieving session data from Redis:', error);
    return null;
  }
}

//  Session Data Deletion Function
export async function deleteSessionData(userId: string): Promise<any | null> {
  try {
    const sessionKey = `session:${userId}`;
    await redisClient.del(sessionKey);
    return 'Deleted successfully';
  } catch (error) {
    console.error('Error deleting session data from Redis:', error);
    return null;
  }
}

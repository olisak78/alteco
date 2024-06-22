import dotenv from 'dotenv';

// Configuration file

dotenv.config();

interface Config {
  db: {
    mongoDBhost: string;
    mongoDBname: string;
    mongoDBcollection: string;
    redisDBhost: string;
    redisDBport: string;
    redisDBpassword: string;
  };
}

const config: Config = {
  db: {
    mongoDBhost: process.env.MONGODB_URI || '',
    mongoDBname: process.env.MONGODB_DBNAME || '',
    mongoDBcollection: process.env.MONGODB_COLLECTION || '',
    redisDBhost: process.env.REDISDB_HOST || '',
    redisDBport: process.env.REDISDB_PORT || '6379',
    redisDBpassword: process.env.REDISDB_PASSWORD || '',
  },
};

export default config;

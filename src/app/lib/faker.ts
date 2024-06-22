import { faker } from '@faker-js/faker';
import { Status, User } from '../types';
import { connectToDatabase } from './mongodb';
import config from '../config/config';
import { encryptPassword } from './encrypt';

// This utility file is needed for generating fake demo users and inserting them to MongoDB

// This function receives how many users to generate and returns an array of that many users
export const generateUserData = (numUsers: number): Array<any> => {
  const users: User[] = [];
  for (let i = 0; i < numUsers; i++) {
    users.push({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: encryptPassword(faker.internet.password()), // the passwords should be encrypted, but it slows the process significantly
      lastUpdated: faker.date.past(),
      status: Status.Working,
    });
  }
  return users;
};

// This function populates the MongoDB with fake generated users data
export async function populateDatabase(amount: number) {
  const userData = generateUserData(amount); // prepare the list of faked users
  const client = await connectToDatabase(); // establish the connection to MongoDB
  const collection = client
    .db(config.db.mongoDBname)
    .collection(config.db.mongoDBcollection);
  try {
    await collection.insertMany(userData, { ordered: false }); //insert the list to MongoDB, not ordered, for faster process
    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    client.close();
  }
}

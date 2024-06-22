import bcrypt from 'bcryptjs';

// This utility file is needed for encrypting the passwords of users, before saving them to MongoDB

// Function for encrypting the passwords
export function encryptPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

// Function for verifying the password by comparing the encrypted password to normal one.
export async function verifyPassword(
  password: string,
  encryptedPassword: string
) {
  const match = await bcrypt.compare(password, encryptedPassword);
  return match;
}

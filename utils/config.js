import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_TEST_URI
    : process.env.MONGODB_URI;

export const { SECRET_KEY } = process.env;

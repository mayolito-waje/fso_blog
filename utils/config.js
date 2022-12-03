import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI
  : process.env.MONGODB_TEST_URI;

export const { PORT } = process.env;

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/user.js';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(() => {
  mongoose.connection.close();
});

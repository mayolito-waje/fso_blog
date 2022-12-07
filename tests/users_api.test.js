import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import * as helper from './test_helpers.js';

const api = supertest(app);

beforeEach(async () => {
  await helper.seedUsers();
}, 100000);

describe('fetching users', () => {
  test('should fetch all users and return json', async () => {
    const fetchedUsers = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(fetchedUsers.body).toHaveLength(helper.users.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

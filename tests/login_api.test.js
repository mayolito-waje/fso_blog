import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import * as helper from './test_helpers.js';

const api = supertest(app);

beforeEach(async () => {
  await helper.seedUsers();
}, 100000);

describe('login', () => {
  test('successfully login and return token', async () => {
    const result = await api
      .post('/login')
      .send({
        username: 'root',
        password: 'secretPassword#1',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.token).toBeDefined();
  });

  test('should not log in when username is not in database', async () => {
    await api
      .post('/login')
      .send({
        username: 'notauser',
        password: 'Fehn09#$2',
      })
      .expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

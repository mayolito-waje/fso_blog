import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import * as helper from './test_helpers.js';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const users = await Promise.all(helper.users.map(async (user) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);

    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    });

    return newUser;
  }));

  const promises = users.map((user) => user.save());
  await Promise.all(promises);
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

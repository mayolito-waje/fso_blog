import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/user.js';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('secretPassword#1', saltRounds);
  const testUser = new User({
    username: 'root',
    name: 'superuser',
    passwordHash,
  });

  await testUser.save();
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

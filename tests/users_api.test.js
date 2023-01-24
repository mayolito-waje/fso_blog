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

describe('creating users', () => {
  test('should successfully create user with valid details', async () => {
    const newUser = {
      username: 'newUser',
      name: 'test newUser',
      password: 'newUser#001',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.users.length + 1);
  });

  test('request body should contain username, name, and password fields', async () => {
    const badRequests = [
      {
        name: 'test',
        password: 'testPassword#001',
      },
      {
        username: 'test',
        password: 'testPassword#001',
      },
      {
        name: 'test',
        username: 'test',
      },
    ];

    await Promise.all(
      badRequests.map(async (badRequest) => {
        await api.post('/api/users').send(badRequest).expect(400);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(helper.users.length);
      }),
    );
  });

  test('password should contain at least one small letter, capital letter, number, and special character', async () => {
    const badPasswordRequest = {
      username: 'test',
      name: 'test',
      password: 'badpassword',
    };

    const result = await api
      .post('/api/users')
      .send(badPasswordRequest)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe(
      'password should contain one: small letter, capital letter, number, and special character',
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.users.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import * as helper from './test_helpers.js';

const api = supertest(app);

describe('POST /api/testing/reset', () => {
  test('should properly reset db', async () => {
    await helper.seedUsers();
    await helper.seedBlogs();

    await api.post('/api/testing/reset').expect(204);

    const usersAtEnd = await helper.usersInDb();
    const blogsAtEnd = await helper.blogsInDb();
    expect(usersAtEnd).toHaveLength(0);
    expect(blogsAtEnd).toHaveLength(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

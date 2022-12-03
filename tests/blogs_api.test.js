import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import * as helpers from './test_helpers.js';
import Blog from '../models/blog.js';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogLists = helpers.blogs
    .map((blog) => new Blog(blog));
  const promises = blogLists.map((blog) => blog.save());

  await Promise.all(promises);
});

test('GET /api/blogs - should return json', async () => {
  api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('GET /api/blogs - should return all blogs', async () => {
  const contents = await api.get('/api/blogs');
  expect(contents.body).toHaveLength(helpers.blogs.length);
});

test('GET /api/blogs - returned blogs should contain specific blog', async () => {
  const contents = await api.get('/api/blogs');

  expect(contents.body).toContainEqual({
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  });
});

test('unique identifiers should be named \'id\'', async () => {
  const contents = await api.get('/api/blogs');
  const blogToCheck = contents.body[0];

  expect(blogToCheck.id).toBeDefined();
});

test('GET /api/blogs/:id - return the blog if id is available', async () => {
  const blogsAtStart = await helpers.blogsInDb();
  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultBlog.body).toEqual(blogToView);
});

test('GET /api/blogs/:id - unavailable id should return 404', async () => {
  const unknownId = await helpers.unknownId();

  await api
    .get(`/api/blogs/${unknownId}`)
    .expect(404);
});

afterAll(() => {
  mongoose.connection.close();
});

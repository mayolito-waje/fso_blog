import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import * as helpers from './test_helpers.js';
import Blog from '../models/blog.js';
import blog from '../models/blog.js';

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

  const titles = contents.body.map((r) => r.title);
  expect(titles).toContain('Go To Statement Considered Harmful');
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

test('POST /api/blogs - successfully added a new blog post', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Sample Author',
    url: 'https://google.com/',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helpers.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helpers.blogs.length + 1);
  const titles = blogsAtEnd.map((r) => r.title);
  expect(titles).toContain('Test Blog');
});

afterAll(() => {
  mongoose.connection.close();
});

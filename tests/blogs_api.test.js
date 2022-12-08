import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import * as helper from './test_helpers.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';

const api = supertest(app);

const loginRootAndGetToken = async () => {
  const user = await api
    .post('/login')
    .send({
      username: 'root',
      password: 'secretPassword#1',
    })
    .expect(200);

  const { token } = user.body;
  return token;
};

beforeEach(async () => {
  await helper.seedUsers();
  await Blog.deleteMany({});

  const rootUser = await User.findOne({ username: 'root' });
  const id = rootUser._id;

  const blogLists = helper.blogs
    .map((blog) => new Blog({
      ...blog,
      user: id,
    }));

  const promises = blogLists.map((blog) => blog.save());

  await Promise.all(promises);
}, 100000);

describe('getting all blogs', () => {
  test('should return json', async () => {
    const token = await loginRootAndGetToken();

    await api
      .get('/api/blogs')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('should return all blogs', async () => {
    const token = await loginRootAndGetToken();

    const contents = await api
      .get('/api/blogs')
      .auth(token, { type: 'bearer' });
    expect(contents.body).toHaveLength(helper.blogs.length);
  });

  test('returned blogs should contain specific blog', async () => {
    const token = await loginRootAndGetToken();

    const contents = await api.get('/api/blogs')
      .auth(token, { type: 'bearer' });

    const titles = contents.body.map((r) => r.title);
    expect(titles).toContain('Go To Statement Considered Harmful');
  });

  test('unique identifiers should be named \'id\'', async () => {
    const token = await loginRootAndGetToken();

    const contents = await api.get('/api/blogs')
      .auth(token, { type: 'bearer' });
    const blogToCheck = contents.body[0];

    expect(blogToCheck.id).toBeDefined();
  });
});

describe('fetch blog with specific id', () => {
  test('return the blog if id is available', async () => {
    const token = await loginRootAndGetToken();

    const fetchedBlogs = await helper.blogsInDb();
    const blogToView = fetchedBlogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body.title).toBe(blogToView.title);
  });

  test('unavailable id should return 404', async () => {
    const token = await loginRootAndGetToken();
    const unknownId = await helper.unknownId();

    await api
      .get(`/api/blogs/${unknownId}`)
      .auth(token, { type: 'bearer' })
      .expect(404);
  });

  test('invalid id should return 400', async () => {
    const invalidId = '12kdn359d24as';
    const token = await loginRootAndGetToken();

    await api
      .get(`/api/blogs/${invalidId}`)
      .auth(token, { type: 'bearer' })
      .expect(400);
  });
});

describe('handle POST requests', () => {
  test('POST /api/blogs - successfully added a new blog post', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Sample Author',
      url: 'https://test-url.com',
      likes: 7,
    };

    const token = await loginRootAndGetToken();

    await api
      .post('/api/blogs')
      .send(newBlog)
      .auth(token, { type: 'bearer' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);
    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain('Test Blog');
  });

  test('should not add a new blog if token is wrong or missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Sample Author',
      url: 'https://test-url.com',
      likes: 7,
    };

    await api
      .post('/login')
      .send(newBlog)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);
  });

  test('If the likes keys is missing, it should default to 0', async () => {
    const testBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test-url.com',
    };

    const token = await loginRootAndGetToken();

    await api
      .post('/api/blogs')
      .send(testBlog)
      .auth(token, { type: 'bearer' });

    const testBlogAtEnd = await Blog.findOne({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test-url.com',
    });

    expect(testBlogAtEnd.likes).toBe(0);
  });

  test('POST request should include title and author keys', async () => {
    const badBlogObject = {
      url: 'https://test-url.com',
      likes: 7,
    };

    const token = await loginRootAndGetToken();

    await api
      .post('/api/blogs')
      .send(badBlogObject)
      .auth(token, { type: 'bearer' })
      .expect(400);

    const checkBlog = await Blog.findOne({
      url: 'https://test-url.com',
      likes: 7,
    });

    expect(checkBlog).toBe(null);
  });
});

describe('handle DELETE requests', () => {
  test('delete a blog resource with available id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const idToDelete = blogToDelete.id;

    const token = await loginRootAndGetToken();

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .auth(token, { type: 'bearer' })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('should prohibit deletion if wrong token is sent or blog is not by the current log in user', async () => {
    const differentUser = await api
      .post('/login')
      .send({
        username: 'user1',
        password: 'secretPassword#2',
      });

    const { token } = differentUser.body;

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const idToDelete = blogToDelete.id;

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .auth(token, { type: 'bearer' })
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain(blogToDelete.title);
  });
});

describe('handle blog updates', () => {
  test('update a blog with available id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const idToUpdate = blogToUpdate.id;

    const token = await loginRootAndGetToken();

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send({ likes: 24 })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];
    expect(updatedBlog.likes).toBe(24);
  });

  test('only authorized the blog update to owner', async () => {
    const differentUser = await api
      .post('/login')
      .send({
        username: 'user1',
        password: 'secretPassword#2',
      });

    const { token } = differentUser.body;

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const idToUpdate = blogToUpdate.id;

    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send({ likes: 24 })
      .auth(token, { type: 'bearer' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];
    expect(updatedBlog.likes).not.toBe(24);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

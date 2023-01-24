import bcrypt from 'bcrypt';
import Blog from '../models/blog.js';
import User from '../models/user.js';

export const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

export const users = [
  {
    username: 'root',
    name: 'superuser',
    password: 'secretPassword#1',
  },
  {
    username: 'user1',
    name: 'user1',
    password: 'secretPassword#2',
  },
  {
    username: 'user2',
    name: 'user2',
    password: 'secretPassword#3',
  },
];

export const seedUsers = async () => {
  await User.deleteMany({});

  const makeUsers = await Promise.all(
    users.map(async (user) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      const newUser = new User({
        username: user.username,
        name: user.name,
        passwordHash,
      });

      return newUser;
    }),
  );

  const promises = makeUsers.map((user) => user.save());
  await Promise.all(promises);
};

export const seedBlogs = async () => {
  // expect to have root user
  await Blog.deleteMany({});

  const rootUser = await User.findOne({ username: 'root' });
  const id = rootUser._id;

  const blogLists = blogs.map(
    (blog) =>
      new Blog({
        ...blog,
        user: id,
      }),
  );

  const promises = blogLists.map((blog) => blog.save());
  await Promise.all(promises);
};

export const blogsInDb = async () => {
  const getBlogs = await Blog.find({});
  return getBlogs.map((blog) => blog.toJSON());
};

export const usersInDb = async () => {
  const getUsers = await User.find({});
  return getUsers.map((user) => user.toJSON());
};

export const unknownId = async () => {
  const unknownBlog = new Blog({
    title: 'to delete',
    author: 'to delete',
  });
  await unknownBlog.save();
  await unknownBlog.remove();

  return unknownBlog._id;
};

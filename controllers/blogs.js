import express from 'express';
import 'express-async-errors';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Blog from '../models/blog.js';
import * as config from '../utils/config.js';

const blogsRouter = express.Router();

blogsRouter.get('/:id', async (req, res, next) => {
  const fetchedBlog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 });

  if (fetchedBlog) {
    res.json(fetchedBlog);
  } else {
    next();
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (updatedBlog) {
    res.json(updatedBlog);
  } else {
    next();
  }
});

blogsRouter.delete('/:id', async (req, res) => {
  const { user } = req;
  const tokenId = user.toString();

  const blogToDelete = await Blog.findById(req.params.id);
  const ownerId = blogToDelete.user.toString();

  if (tokenId !== ownerId) {
    return res.status(401).json({
      error: 'you are not authorized to delete this blog',
    });
  }

  await blogToDelete.remove();
  return res.status(204).send();
});

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { body, token } = req;
  const decodedToken = jwt.verify(token, config.SECRET_KEY);

  if (!decodedToken) {
    return res.status(401).json({
      error: 'invalid token or missing',
    });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  return res.status(201).json(savedBlog);
});

export default blogsRouter;

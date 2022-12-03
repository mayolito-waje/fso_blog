import express from 'express';
import 'express-async-errors';
import Blog from '../models/blog.js';

const blogsRouter = express.Router();

blogsRouter.get('/:id', async (req, res, next) => {
  const fetchedBlog = await Blog.findById(req.params.id);

  if (fetchedBlog) {
    res.json(fetchedBlog);
  } else {
    next();
  }
});

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body);

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

export default blogsRouter;

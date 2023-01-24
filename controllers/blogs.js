import express from 'express';
import _ from 'lodash';
import User from '../models/user.js';
import Blog from '../models/blog.js';

const blogsRouter = express.Router();

blogsRouter.get('/:id', async (req, res, next) => {
  const { user } = req;

  const fetchedBlog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  });

  if (fetchedBlog) {
    if (user.id.toString() !== fetchedBlog.user.id.toString()) {
      return res
        .status(401)
        .send({ error: 'You are not allowed to view this blog' });
    }

    return res.json(fetchedBlog);
  }

  return next();
});

blogsRouter.patch('/:id', async (req, res, next) => {
  const { user, body } = req;
  const tokenId = user.id.toString();

  const blogToUpdate = await Blog.findById(req.params.id);
  if (_.isNull(blogToUpdate)) {
    return next();
  }

  const ownerId = blogToUpdate.user.toString();

  if (tokenId !== ownerId) {
    return res.status(401).json({
      error: 'you are not authorized to update this blog',
    });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  }).populate('user', { username: 1, name: 1 });

  return res.json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const { user } = req;
  const tokenId = user.id.toString();

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

  return res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { body } = req;

  const userId = req.user.id.toString();
  const user = await User.findById(userId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  const populatedBlog = await Blog.findById(savedBlog.id).populate('user', {
    username: 1,
    name: 1,
  });

  return res.status(201).json(populatedBlog);
});

export default blogsRouter;

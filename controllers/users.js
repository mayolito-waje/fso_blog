import express from 'express';
import bcrypt from 'bcrypt';
import 'express-async-errors';
import User from '../models/user.js';

const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const validPasswordRegex = /^(?=.*[A-Z])(?=.*[@$!%*#?&])(?=.*[a-z])(?=.*\d).{8,}$/g;
  const validPassword = validPasswordRegex.test(password);

  if (!validPassword) {
    return res.status(400).json({
      error: 'password should contain one: small letter, capital letter, number, and special character',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({ username, name, passwordHash });
  const createdUser = await newUser.save();

  return res.status(201).json(createdUser);
});

export default usersRouter;

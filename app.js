import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import blogsRouter from './controllers/blogs.js';
import * as config from './utils/config.js';
import * as logger from './utils/logger.js';
import * as middleware from './utils/middleware.js';
import loginRouter from './controllers/login.js';
import usersRouter from './controllers/users.js';

const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB: ', err.message);
  });

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(middleware.tokenExtractor);

app.use('/login', loginRouter);
app.use('/api/users', usersRouter);
app.use(
  '/api/blogs',
  middleware.userExtractor,
  blogsRouter,
);

app.use(middleware.resourceNotFound);
app.use(middleware.errorHandler);

export default app;

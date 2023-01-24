import jwt from 'jsonwebtoken';
import * as logger from './logger.js';
import * as config from './config.js';

export const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7);
    req.token = token;
  }

  next();
};

export const userExtractor = (req, res, next) => {
  const { token } = req;
  if (!token) return next();

  const decodedToken = jwt.verify(token, config.SECRET_KEY);
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token is invalid',
    });
  }
  req.user = decodedToken;

  return next();
};

export const resourceNotFound = (req, res) =>
  res.status(404).json({
    error: 'Resource Not Found',
    status: 404,
  });

export const errorHandler = (err, req, res, next) => {
  logger.error('Error: ', err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }

  return next(err);
};

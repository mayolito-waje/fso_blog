import * as logger from './logger.js';

export const resourceNotFound = (req, res) => res.status(404).json(
  {
    error: 'Resource Not Found',
    status: 404,
  },
);

// eslint-disable-next-line consistent-return
export const errorHandler = (err, req, res, next) => {
  logger.error('Error: ', err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

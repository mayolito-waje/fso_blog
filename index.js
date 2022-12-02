import http from 'http';
import app from './app.js';
import * as logger from './utils/logger.js';
import * as config from './utils/config.js';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server is listening on port ${config.PORT}`);
});

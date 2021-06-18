const express = require('express');

const routerInitializer = require('./routerInitializer');
const middlewareInitializer = require('./middlewareInitializer');
const db = require('../db');
const Logger = require('../logger');
const config = require('../config');

async function server() {
  const logger = Logger.getLog();
  logger.info('Start to initialize server');
  const app = express();

  const link = `http://${config.host}:${config.port.toString()}`;

  await middlewareInitializer.initCommon(app);
  routerInitializer.init(app, link);
  await middlewareInitializer.initError(app);
  await db.init();
  app.listen(config.port, config.host, () => {
    logger.info(
      `Server  started listening at ${config.host} on ${config.port} port.`,
    );
  });
}

module.exports = {
  server,
};

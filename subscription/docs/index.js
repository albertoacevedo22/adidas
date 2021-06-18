const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const Logger = require('../src/logger');
const config = require('../src/config');

async function docServer() {
  const logger = Logger.getLog();
  logger.info('Start to initialize document server');
  const app = express();

  app.use(cors());
  const swaggerDocument = YAML.load('./docs/api.yaml');
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(config.docsPort, config.host, () => {
    logger.info(
      `Document server started listening at ${config.host} on ${config.docsPort} port.`,
    );
  });
}

module.exports = {
  docServer,
};

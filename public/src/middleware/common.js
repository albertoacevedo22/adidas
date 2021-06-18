const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const Logger = require('../logger');

class CommonMiddleware {
  constructor(app) {
    this.app = app;
  }

  async useBodyParser() {
    this.app.use(express.json());
  }

  async useURLencoded() {
    this.app.use(
      express.urlencoded({
        extended: true,
      }),
    );
  }

  async useCors() {
    this.app.use(cors());
  }

  async useHelmet() {
    this.app.use(helmet());
  }

  async logRequests() {
    const logger = Logger.getLog();
    this.app.use((req, res, done) => {
      logger.info(req.originalUrl);
      done();
    });
  }
}

module.exports = {
  CommonMiddleware,
};

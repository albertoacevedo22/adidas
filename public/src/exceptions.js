/* eslint-disable max-classes-per-file */

const Logger = require('./logger');

const logger = Logger.getLog();

class DataException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataException';
    logger.error(message);
  }
}
class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    logger.error(message);
  }
}

module.exports = {
  DataException, ValidationException,
};

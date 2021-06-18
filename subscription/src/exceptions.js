/* eslint-disable max-classes-per-file */

const Logger = require('./logger');

const logger = Logger.getLog();

class DatabaseException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseException';
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

class NotificationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    logger.error(message);
  }
}

module.exports = {
  DatabaseException, ValidationException, NotificationException,
};

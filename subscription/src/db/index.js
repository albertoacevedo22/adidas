const mongoose = require('mongoose');
const { backOff } = require('exponential-backoff');

const { SubscriptionEntity } = require('./entities/subscriptionEntity');
const { DatabaseException } = require('../exceptions');

const {
  username, password, dbHost, dbPort, authMechanism, dbName,
  mongoStartBackOffMs, mongoMaxBackOffMs, mongoMaxRetry,
} = require('../config');

const entities = {};

async function init() {
  const backOffOptions = {
    startingDelay: mongoStartBackOffMs,
    maxDelay: mongoMaxBackOffMs,
    numOfAttempts: mongoMaxRetry,
  };
  try {
    const db = await backOff(() => connect(), backOffOptions);
    entities.subscription = new SubscriptionEntity(db);
    return db;
  } catch (error) {
    throw new DatabaseException(error.message);
  }
}

async function connect() {
  const uri = getUrl();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  return mongoose;
}

function getUrl() {
  return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${dbHost}:${dbPort}/${dbName}?authSource=admin&authMechanism=${authMechanism}`;
}

function getEntity(entity) {
  return entities[entity];
}

module.exports = {
  init,
  getEntity,
};

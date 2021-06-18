const config = {
  port: process.env.PORT || 3000,
  docsPort: process.env.DOCS_PORT || 3001,
  host: process.env.HOST || 'localhost',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'example',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: process.env.DB_PORT || '27017',
  authMechanism: process.env.DB_AUTHMECHANISM || 'DEFAULT',
  dbName: process.env.DB_NAME || 'adidas',
  mongoStartBackOffMs: process.env.DB_START_BACKOFF || 200,
  mongoMaxBackOffMs: process.env.DB_MAX_BACKOFF || 5000,
  mongoMaxRetry: process.env.DB_MAX_RETRY || 5,
  clientId: process.env.CLIENT_ID || 'my-app',
  brokers: stringEnvToArray(process.env.BROKERS) || ['localhost:9092'],
  topic: process.env.TOPIC || 'subscription',
};

function stringEnvToArray(string) {
  if (string) {
    return string.split(',');
  }
  return undefined;
}

module.exports = config;

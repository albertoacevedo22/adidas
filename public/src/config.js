const config = {
  port: process.env.PORT || 4005,
  docsPort: process.env.DOCS_PORT || 4006,
  host: process.env.HOST || 'localhost',
  subscriptionServerUrl: process.env.SUBSCRIPTION_SERVER_URL || 'http://localhost:3000',
};

module.exports = config;

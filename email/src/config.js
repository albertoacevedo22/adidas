const config = {
  clientId: process.env.CLIENT_ID || 'my-app',
  brokers: stringEnvToArray(process.env.BROKERS) || ['localhost:9092'],
  topic: process.env.TOPIC || 'subscription',
  groupId: process.env.GROUP_ID || 'subscription-group',
};

function stringEnvToArray(string) {
  if (string) {
    return string.split(',');
  }
  return undefined;
}

module.exports = config;

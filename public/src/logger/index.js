const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'app',
  level: 'debug',
  stream: process.stderr,
});

function getLog() {
  return log;
}

module.exports = {
  getLog,
};

const consumer = require('./consumer');
const processor = require('./processor');

async function run() {
  await consumer.run(processor.process);
}

async function stop() {
  await consumer.stop();
}

module.exports = {
  run, stop,
};

const { Kafka } = require('kafkajs');
const {
  clientId, brokers, topic, groupId,
} = require('../config');

const kafka = new Kafka({
  clientId,
  brokers,
});

const consumer = kafka.consumer({ groupId });

async function run(messageProcessor) {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      messageProcessor(message.value);
    },
  });
}

async function stop() {
  await consumer.disconnect();
}

module.exports = {
  run, stop,
};

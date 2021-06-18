const { Kafka } = require('kafkajs');
const { clientId, brokers, topic } = require('../config');
const { NotificationException } = require('../exceptions');

async function notify(subscription) {
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  try {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        { value: serializeMessage(subscription) },
      ],
    });

    await producer.disconnect();
  } catch (error) {
    throw new NotificationException(error.message);
  }
}

function serializeMessage(message) {
  return JSON.stringify(message);
}

module.exports = {
  notify,
};

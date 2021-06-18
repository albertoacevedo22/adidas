/* eslint-disable no-console */
const service = require('./src');

console.log('Service started');

service.run().catch((e) => console.error(`[example/consumer] ${e.message}`, e));

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

// eslint-disable-next-line array-callback-return
errorTypes.map((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await service.stop();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

// eslint-disable-next-line array-callback-return
signalTraps.map((type) => {
  process.once(type, async () => {
    try {
      await service.stop();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

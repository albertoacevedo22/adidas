const { Kafka } = require('kafkajs');

jest.mock('kafkajs');
const { topic } = require('../../../src/config');
const { notify } = require('../../../src/notification');

const { NotificationException } = require('../../../src/exceptions');

const mockKafka = () => {
  const res = {};
  res.producer = jest.fn().mockReturnValue(res);
  res.connect = jest.fn().mockResolvedValue(res);
  res.send = jest.fn().mockResolvedValue(res);
  res.disconnect = jest.fn().mockResolvedValue(res);
  return res;
};

beforeEach(() => {
  Kafka.mockClear();
});

describe('Subscription routes', () => {
  describe('create', () => {
    test('should send a message serialized to JSON if everything is correct', async () => {
      const mock = mockKafka();
      Kafka.mockImplementation(() => mock);
      const subscription = { some: 'subscription' };

      await notify(subscription);

      expect(mock.producer).toHaveBeenCalled();
      expect(mock.connect).toHaveBeenCalled();
      expect(mock.send).toHaveBeenCalledWith({
        topic,
        messages: [{ value: JSON.stringify(subscription) }],
      });
      expect(mock.disconnect).toHaveBeenCalled();
    });

    test('should throw a NotificationException if anything wrong happens', async () => {
      const producerMock = jest.fn().mockImplementation(() => { throw new NotificationException('some error'); });
      Kafka.mockImplementation(() => ({ producer: producerMock }));

      const subscription = { some: 'subscription' };

      expect(notify(subscription)).rejects.toThrowError(NotificationException);
    });
  });
});

const { BaseEntity } = require('../../../../src/db/entities/baseEntity');
const { SubscriptionEntity } = require('../../../../src/db/entities/subscriptionEntity');
const { SubscriptionSchema } = require('../../../../src/db/schemas/subscription');

jest.mock('../../../../src/db/entities/baseEntity');

describe('Subscription Entity', () => {
  describe('constructor', () => {
    test('should create model', () => {
      const db = {};

      // eslint-disable-next-line no-unused-vars
      const entity = new SubscriptionEntity(db);

      expect(BaseEntity).toHaveBeenCalled();
      expect(BaseEntity).toHaveBeenCalledWith(db, 'subscription', SubscriptionSchema);
    });
  });
});

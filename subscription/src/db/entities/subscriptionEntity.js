const { BaseEntity } = require('./baseEntity');
const { SubscriptionSchema } = require('../schemas/subscription');

class SubscriptionEntity extends BaseEntity {
  constructor(db) {
    super(db, 'subscription', SubscriptionSchema);
  }
}

module.exports = {
  SubscriptionEntity,
};

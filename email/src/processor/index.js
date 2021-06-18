const Joi = require('joi');
const { ObjectID } = require('mongodb');

const Logger = require('../logger');

const { send } = require('./emailSender');

const subscriptionModel = Joi.object({
  ID: Joi.string().required().custom((value, helper) => {
    if (!ObjectID.isValid(value)) {
      return helper.message('ID is not an correct id');
    }
    return true;
  }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  dateOfBirth: Joi.date().iso().required(),
  consent: Joi.boolean().required(),
  NewsletterId: Joi.required(),
  firstName: Joi.string(),
  gender: Joi.string().valid('male', 'female'),
  created_at: Joi.date().iso().required(),
  updated_at: Joi.date().iso().required(),
});

function process(message) {
  const logger = Logger.getLog();
  logger.info('message arrived');
  const subscription = deserializeValue(message);
  const result = subscriptionModel.validate(subscription);
  if (!result.error) {
    send(subscription);
  }
}

function deserializeValue(message) {
  return JSON.parse(message);
}

module.exports = {
  process,
};

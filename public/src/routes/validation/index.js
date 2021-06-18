const Joi = require('joi');

const { ValidationException } = require('../../exceptions');

function validateEmail(email) {
  const rule = Joi.object({
    email: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: false }).required(),
  });

  const result = rule.validate({ email });
  if (result.error) {
    throw new ValidationException(result.error.message);
  }
}

function validateSubscription(subscription) {
  const model = Joi.object({
    email: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: false }).required(),
    dateOfBirth: Joi.date().iso().required(),
    consent: Joi.boolean().required(),
    NewsletterId: Joi.string().required(),
    firstName: Joi.string(),
    gender: Joi.string().valid('male', 'female'),
  });

  const result = model.validate(subscription);
  if (result.error) {
    throw new ValidationException(result.error.message);
  }
}

module.exports = {
  validateEmail, validateSubscription,
};

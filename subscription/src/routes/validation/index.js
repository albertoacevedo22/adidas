const { ObjectId } = require('mongoose').Types;
const Joi = require('joi');

const { ValidationException } = require('../../exceptions');

function validateId(id) {
  if (!ObjectId.isValid(id)) {
    throw new ValidationException('Id is not valid');
  }
}

const { CONSENT_AGE } = require('../../constants/business');

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
    dateOfBirth: Joi.date()
      .iso()
      .required()
      .custom((value, helper) => {
        if (calculateAge(value) < CONSENT_AGE) {
          return helper.message(`User has less than ${CONSENT_AGE} necessary for subscribed`);
        }
        return true;
      }),
    consent: Joi.boolean().required().invalid(false),
    NewsletterId: Joi.string().required(),
    firstName: Joi.string(),
    gender: Joi.string().valid('male', 'female'),
  });

  const result = model.validate(subscription);
  if (result.error) {
    throw new ValidationException(result.error.message);
  }
}

function calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

module.exports = {
  validateId, validateEmail, validateSubscription,
};

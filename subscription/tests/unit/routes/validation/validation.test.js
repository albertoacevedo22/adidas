const {
  validateId, validateEmail, validateSubscription,
} = require('../../../../src/routes/validation');
const { ValidationException } = require('../../../../src/exceptions');

describe('Validators', () => {
  describe('validateId', () => {
    test('should throw exception if Id is incorrect', () => {
      const Id = 'unvalid id';

      expect(() => validateId(Id)).toThrow(ValidationException);
    });

    test('should not throw exception if Id is correct', () => {
      const Id = '60cb3e2931c8350013a2a3bd';

      expect(() => validateId(Id)).not.toThrow(ValidationException);
    });
  });

  describe('validateEmail', () => {
    test('should throw exception if Email is incorrect', () => {
      const email = 'unvalid mail';

      expect(() => validateEmail(email)).toThrow(ValidationException);
    });

    test('should not throw exception if Email is correct', () => {
      const email = 'some@email.com';

      expect(() => validateEmail(email)).not.toThrow(ValidationException);
    });
  });

  describe('validateSubscription', () => {
    test('should throw exception if Subscription is incorrect', () => {
      const subscription = {};

      expect(() => validateSubscription(subscription)).toThrow(ValidationException);
    });

    test('should throw exception if user not consents incorrect', () => {
      const subscription = {
        email: 'some@email.com',
        dateOfBirth: '1990-06-15T21:56:48.755Z',
        consent: false,
        NewsletterId: 'some-id',
      };

      expect(() => validateSubscription(subscription)).toThrow(ValidationException);
    });

    test('should throw exception if user has lest than 18 years', () => {
      const subscription = {
        email: 'some@email.com',
        dateOfBirth: '2021-06-15T21:56:48.755Z',
        consent: true,
        NewsletterId: 'some-id',
      };

      expect(() => validateSubscription(subscription)).toThrow(ValidationException);
    });

    test('should not throw exception if subscription is correct', () => {
      const subscription = {
        email: 'some@email.com',
        dateOfBirth: '1990-06-15T21:56:48.755Z',
        consent: true,
        NewsletterId: 'some-id',
      };

      expect(() => validateSubscription(subscription)).not.toThrow(ValidationException);
    });
  });
});

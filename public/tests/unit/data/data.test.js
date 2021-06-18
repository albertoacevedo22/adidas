const axios = require('axios');

const { createSubscription, checkEmail } = require('../../../src/data');
const { BAD_REQUEST, NOT_FOUND } = require('../../../src/constants/http');
const { subscriptionServerUrl } = require('../../../src/config');
const { DataException, ValidationException } = require('../../../src/exceptions');

jest.mock('axios');

beforeEach(() => {
  axios.mockClear();
});

describe('Data', () => {
  describe('create', () => {
    test('should return service response if there is no error', async () => {
      const subscription = { some: 'subscription' };
      const expectedResponse = { some: 'response' };
      axios.put.mockResolvedValue({ data: expectedResponse });

      const response = await createSubscription(subscription);

      expect(response).toEqual(expectedResponse);
      expect(axios.put).toHaveBeenCalledWith(`${subscriptionServerUrl}/subscription`, { subscription });
    });

    test('should return a validation error if BAD_REQUEST happens', async () => {
      const subscription = { some: 'subscription' };
      const error = {
        response: {
          status: BAD_REQUEST,
          data: 'some data',
        },
      };
      axios.put.mockResolvedValue(Promise.reject(error));

      expect(createSubscription(subscription)).rejects.toThrowError(ValidationException);
    });

    test('should return a data error if other error happens', async () => {
      const subscription = { some: 'subscription' };
      const error = {
        response: {
          status: NOT_FOUND,
          data: 'some data',
        },
      };
      axios.put.mockResolvedValue(Promise.reject(error));

      expect(createSubscription(subscription)).rejects.toThrowError(DataException);
    });
  });

  describe('emailSubscribed', () => {
    test('should return service response if there is no error', async () => {
      const email = 'some@email.com';
      const expectedResponse = { some: 'response' };
      axios.post.mockResolvedValue({ data: expectedResponse });

      const response = await checkEmail(email);

      expect(response).toEqual(expectedResponse);
      expect(axios.post).toHaveBeenCalledWith(`${subscriptionServerUrl}/subscription/email`, { email });
    });

    test('should return a validation error if BAD_REQUEST happens', async () => {
      const email = 'some@email.com';
      const error = {
        response: {
          status: BAD_REQUEST,
          data: 'some data',
        },
      };
      axios.post.mockResolvedValue(Promise.reject(error));

      expect(checkEmail(email)).rejects.toThrowError(ValidationException);
    });

    test('should return a data error if other error happens', async () => {
      const email = 'some@email.com';
      const error = {
        response: {
          status: NOT_FOUND,
          data: 'some data',
        },
      };
      axios.post.mockResolvedValue(Promise.reject(error));

      expect(checkEmail(email)).rejects.toThrowError(DataException);
    });
  });
});

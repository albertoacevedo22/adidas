const {
  create, emailSubscribed,
} = require('../../../../src/routes/handlers/subscriptions');
const { createSubscription, checkEmail } = require('../../../../src/data');
const {
  OK, SERVICE_UNAVAILABLE, BAD_REQUEST, INTERNAL_ERROR,
} = require('../../../../src/constants/http');
const { DataException } = require('../../../../src/exceptions');

jest.mock('../../../../src/data');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  createSubscription.mockClear();
  checkEmail.mockClear();
});

describe('Subscription routes', () => {
  describe('create', () => {
    test('should return BAD REQUEST if model is invalid', async () => {
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
          },
        },
      };
      const response = mockResponse();

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('"dateOfBirth" is required');
    });

    test('should create subscription if user data is correct', async () => {
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '2021-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      createSubscription.mockResolvedValue({ success: true });

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ subscribed: true });
    });

    test('should return success false if subscription already exist', async () => {
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '2021-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      createSubscription.mockResolvedValue({ success: false });

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ subscribed: false });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataBaseException', async () => {
      const expectedErrorMsg = 'Service unavailable for the moment';
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '2021-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      createSubscription.mockResolvedValue(Promise.reject(new DataException(expectedErrorMsg)));

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'Unexpected error';
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '2021-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      createSubscription.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });
  });

  describe('emailSubscribed', () => {
    test('should return BAD REQUEST if Email is invalid', async () => {
      const request = {
        body: {
          email: 'invalid-email',
        },
      };
      const response = mockResponse();

      await emailSubscribed(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('"email" must be a valid email');
    });

    test('should return BAD REQUEST if Email is not present', async () => {
      const request = {
        body: {
        },
      };
      const response = mockResponse();

      await emailSubscribed(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('"email" is required');
    });

    test('should return subscribed to true if email exists', async () => {
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      checkEmail.mockResolvedValue({ success: true });

      await emailSubscribed(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ subscribed: true });
    });

    test('should return subscribed to true if email does not exists', async () => {
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      checkEmail.mockResolvedValue({ success: false });

      await emailSubscribed(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ subscribed: false });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataException', async () => {
      const expectedErrorMsg = 'Service unavailable for the moment';
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      checkEmail.mockResolvedValue(Promise.reject(new DataException(expectedErrorMsg)));

      await emailSubscribed(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'Unexpected error';
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      checkEmail.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));

      await emailSubscribed(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });
  });
});

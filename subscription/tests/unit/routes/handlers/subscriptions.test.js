const {
  create, cancel, get, getAll, getByEmail,
} = require('../../../../src/routes/handlers/subscriptions');
const db = require('../../../../src/db');
const {
  OK, SERVICE_UNAVAILABLE, BAD_REQUEST, INTERNAL_ERROR,
} = require('../../../../src/constants/http');
const { DatabaseException, NotificationException } = require('../../../../src/exceptions');
const { notify } = require('../../../../src/notification');

jest.mock('../../../../src/db');
jest.mock('../../../../src/notification');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  db.getEntity.mockClear();
  notify.mockClear();
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

    test('should return success false if subscription already exist', async () => {
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '1990-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      const mockEntity = {
        create: jest.fn(),
      };
      mockEntity.create.mockReturnValue(false);
      db.getEntity.mockReturnValue(mockEntity);

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: false });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataBaseException', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '1990-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      const mockEntity = {
        create: jest.fn(),
      };
      mockEntity.create.mockResolvedValue(Promise.reject(new DatabaseException(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        body: {
          subscription: {
            email: 'some@email.com',
            dateOfBirth: '1990-06-15T21:56:48.755Z',
            consent: true,
            NewsletterId: 'some-id',
          },
        },
      };
      const response = mockResponse();
      const mockEntity = {
        create: jest.fn(),
      };
      mockEntity.create.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await create(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith('Unexpected error');
    });

    describe('Notification error', () => {
      test('should delete return OK and success false if notification error', async () => {
        const idCreated = 'someId';
        const expectedErrorMsg = 'some error';
        const request = {
          body: {
            subscription: {
              email: 'some@email.com',
              dateOfBirth: '1990-06-15T21:56:48.755Z',
              consent: true,
              NewsletterId: 'some-id',
            },
          },
        };
        const response = mockResponse();
        const mockEntity = {
          create: jest.fn(),
          delete: jest.fn(),
        };
        mockEntity.create.mockResolvedValue({ ID: idCreated, email: 'some' });
        db.getEntity.mockReturnValue(mockEntity);
        notify.mockResolvedValue(Promise.reject(new NotificationException(expectedErrorMsg)));

        await create(request, response);

        expect(response.status).toHaveBeenCalledWith(OK);
        expect(mockEntity.delete).toHaveBeenCalledWith(idCreated);
        expect(response.json).toHaveBeenCalledWith({ success: false });
      });

      test('should response with INTERNAL_ERROR on case something happens when deleting a subscription', async () => {
        const idCreated = 'someId';
        const expectedErrorMsg = 'some error';
        const request = {
          body: {
            subscription: {
              email: 'some@email.com',
              dateOfBirth: '1990-06-15T21:56:48.755Z',
              consent: true,
              NewsletterId: 'some-id',
            },
          },
        };
        const response = mockResponse();
        const mockEntity = {
          create: jest.fn(),
          delete: jest.fn(),
        };
        mockEntity.create.mockResolvedValue({ ID: idCreated, email: 'some' });
        mockEntity.delete.mockResolvedValue(Promise.reject(new Error()));
        db.getEntity.mockReturnValue(mockEntity);
        notify.mockResolvedValue(Promise.reject(new NotificationException(expectedErrorMsg)));

        await create(request, response);

        expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
        expect(mockEntity.delete).toHaveBeenCalledWith(idCreated);
      });
    });
  });

  describe('cancel', () => {
    test('should return BAD REQUEST if Id is invalid', async () => {
      const request = {
        params: {
          id: 'invalid-id',
        },
      };
      const response = mockResponse();

      await cancel(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('Id is not valid');
    });

    test('should delete subscription if exists', async () => {
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        delete: jest.fn(),
      };
      mockEntity.delete.mockReturnValue(true);
      db.getEntity.mockReturnValue(mockEntity);

      await cancel(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: true });
    });

    test('should return success false if subscription does not exist', async () => {
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        delete: jest.fn(),
      };
      mockEntity.delete.mockReturnValue(false);
      db.getEntity.mockReturnValue(mockEntity);

      await cancel(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: false });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataBaseException', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        delete: jest.fn(),
      };
      mockEntity.delete.mockResolvedValue(Promise.reject(new DatabaseException(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await cancel(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        delete: jest.fn(),
      };
      mockEntity.delete.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await cancel(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith('Unexpected error');
    });
  });

  describe('get by id', () => {
    test('should return BAD REQUEST if Id is invalid', async () => {
      const request = {
        params: {
          id: 'invalid-id',
        },
      };
      const response = mockResponse();

      await get(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('Id is not valid');
    });

    test('should return subscription if exists', async () => {
      const expectedItem = { some: 'item' };
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        get: jest.fn(),
      };
      mockEntity.get.mockReturnValue(expectedItem);
      db.getEntity.mockReturnValue(mockEntity);

      await get(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: true, subscription: expectedItem });
    });

    test('should return success false if subscription does not exist', async () => {
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        get: jest.fn(),
      };
      mockEntity.get.mockReturnValue(null);
      db.getEntity.mockReturnValue(mockEntity);

      await get(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: false });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataBaseException', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        get: jest.fn(),
      };
      mockEntity.get.mockResolvedValue(Promise.reject(new DatabaseException(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await get(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        params: {
          id: '60c50c205d078d00071d0d7a',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        get: jest.fn(),
      };
      mockEntity.get.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await get(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith('Unexpected error');
    });
  });

  describe('get all', () => {
    test('should return all subscriptions', async () => {
      const expectedItem = [1, 2, 3, 4];
      const request = {};
      const response = mockResponse();
      const mockEntity = {
        getAll: jest.fn(),
      };
      mockEntity.getAll.mockReturnValue(expectedItem);
      db.getEntity.mockReturnValue(mockEntity);

      await getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: true, subscriptions: expectedItem });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataBaseException', async () => {
      const expectedErrorMsg = 'some error';
      const request = {};
      const response = mockResponse();
      const mockEntity = {
        getAll: jest.fn(),
      };
      mockEntity.getAll.mockResolvedValue(Promise.reject(new DatabaseException(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'some error';
      const request = {};
      const response = mockResponse();
      const mockEntity = {
        getAll: jest.fn(),
      };
      mockEntity.getAll.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await getAll(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith('Unexpected error');
    });
  });

  describe('get by email', () => {
    test('should return BAD REQUEST if Email is invalid', async () => {
      const request = {
        body: {
          email: 'invalid-email',
        },
      };
      const response = mockResponse();

      await getByEmail(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('"email" must be a valid email');
    });

    test('should return BAD REQUEST if Email is not present', async () => {
      const request = {
        body: {
        },
      };
      const response = mockResponse();

      await getByEmail(request, response);

      expect(response.status).toHaveBeenCalledWith(BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith('"email" is required');
    });

    test('should return subscription if email exists', async () => {
      const expectedItem = { some: 'item' };
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        findOne: jest.fn(),
      };
      mockEntity.findOne.mockReturnValue(expectedItem);
      db.getEntity.mockReturnValue(mockEntity);

      await getByEmail(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: true, subscription: expectedItem });
    });

    test('should return success false if email does not exist', async () => {
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        findOne: jest.fn(),
      };
      mockEntity.findOne.mockReturnValue(null);
      db.getEntity.mockReturnValue(mockEntity);

      await getByEmail(request, response);

      expect(response.status).toHaveBeenCalledWith(OK);
      expect(response.json).toHaveBeenCalledWith({ success: false });
    });

    test('should return SERVICE_UNAVAILABLE if there are a DataBaseException', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        findOne: jest.fn(),
      };
      mockEntity.findOne.mockResolvedValue(Promise.reject(new DatabaseException(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await getByEmail(request, response);

      expect(response.status).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
      expect(response.send).toHaveBeenCalledWith(expectedErrorMsg);
    });

    test('should return INTERNAL_ERROR if there are an unexpected exception', async () => {
      const expectedErrorMsg = 'some error';
      const request = {
        body: {
          email: 'some@mail.com',
        },
      };
      const response = mockResponse();
      const mockEntity = {
        findOne: jest.fn(),
      };
      mockEntity.findOne.mockResolvedValue(Promise.reject(new Error(expectedErrorMsg)));
      db.getEntity.mockReturnValue(mockEntity);

      await getByEmail(request, response);

      expect(response.status).toHaveBeenCalledWith(INTERNAL_ERROR);
      expect(response.send).toHaveBeenCalledWith('Unexpected error');
    });
  });
});

const { send } = require('../../../src/processor/emailSender');
const Logger = require('../../../src/logger');

jest.mock('../../../src/logger');

beforeEach(() => {
  Logger.getLog.mockClear();
});

describe('processor', () => {
  test('should sent email if message is valid', () => {
    const expectedMessage = {
      ID: '60c50c205d078d00071d0d7a',
      email: 'example@gmail.com',
      dateOfBirth: '2000-01-16T14:29:00.160Z',
      consent: true,
      NewsletterId: '33',
      firstName: 'some name',
      gender: 'female',
      created_at: '2020-03-16T17:29:00.160Z',
      updated_at: '2020-03-16T17:29:00.160Z',
    };
    const logMocked = { info: jest.fn() };
    Logger.getLog.mockReturnValue(logMocked);

    send(expectedMessage);

    expect(logMocked.info).toHaveBeenCalled();
  });
});

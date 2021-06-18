const { process } = require('../../../src/processor');
const { send } = require('../../../src/processor/emailSender');

jest.mock('../../../src/processor/emailSender');

beforeEach(() => {
  send.mockClear();
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

    process(JSON.stringify(expectedMessage));

    expect(send).toHaveBeenCalledWith(expectedMessage);
  });

  test('should not sent email if message is invalid', () => {
    const expectedMessage = {
      ID: 'not-valid',
    };

    process(JSON.stringify(expectedMessage));

    expect(send).not.toHaveBeenCalled();
  });
});

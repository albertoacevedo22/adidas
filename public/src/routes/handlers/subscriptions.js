const { validateEmail, validateSubscription } = require('../validation');
const { DataException, ValidationException } = require('../../exceptions');
const { createSubscription, checkEmail } = require('../../data');
const {
  BAD_REQUEST, OK, SERVICE_UNAVAILABLE, INTERNAL_ERROR,
} = require('../../constants/http');

async function create(req, res) {
  const { subscription } = req.body;
  try {
    validateSubscription(subscription);
    const response = await createSubscription(subscription);
    res.status(OK).json({ subscribed: response.success });
  } catch (error) {
    handleExceptions(res, error);
  }
}

async function emailSubscribed(req, res) {
  const { email } = req.body;
  try {
    validateEmail(email);
    const response = await checkEmail(email);
    res.status(OK).json({ subscribed: response.success });
  } catch (error) {
    handleExceptions(res, error);
  }
}

const errorHandlers = [
  {
    is: (error) => error instanceof ValidationException,
    handle: (res, error) => { res.status(BAD_REQUEST).send(error.message); },
  },
  {
    is: (error) => error instanceof DataException,
    handle: (res) => { res.status(SERVICE_UNAVAILABLE).send('Service unavailable for the moment'); },
  },
  {
    is: () => true,
    handle: (res) => { res.status(INTERNAL_ERROR).send('Unexpected error'); },
  },
];

function handleExceptions(res, error) {
  errorHandlers.find((handler) => handler.is(error)).handle(res, error);
}

module.exports = {
  create, emailSubscribed,
};

const axios = require('axios');

const { BAD_REQUEST } = require('../constants/http');
const { subscriptionServerUrl } = require('../config');
const { DataException, ValidationException } = require('../exceptions');

async function checkEmail(email) {
  let response;
  try {
    response = await axios.post(`${subscriptionServerUrl}/subscription/email`, { email });
  } catch (error) {
    handlerError(error);
  }
  return response.data;
}

async function createSubscription(subscription) {
  let response;
  try {
    response = await axios.put(`${subscriptionServerUrl}/subscription`, { subscription });
  } catch (error) {
    handlerError(error);
  }
  return response.data;
}

const errorHandlers = [
  {
    is: (error) => error.response.status === BAD_REQUEST,
    handle: (error) => { throw new ValidationException(error.response.data); },
  },
  {
    is: () => true,
    handle: (error) => { throw new DataException(error.response.data); },
  },
];

function handlerError(error) {
  errorHandlers.find((handler) => handler.is(error)).handle(error);
}

module.exports = {
  checkEmail, createSubscription,
};

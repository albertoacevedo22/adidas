const { validateId, validateEmail, validateSubscription } = require('../validation');
const db = require('../../db');
const {
  BAD_REQUEST, OK, SERVICE_UNAVAILABLE, INTERNAL_ERROR,
} = require('../../constants/http');
const { notify } = require('../../notification');
const { DatabaseException, ValidationException, NotificationException } = require('../../exceptions');
const Logger = require('../../logger');

async function create(req, res) {
  const subscriptionEntity = db.getEntity('subscription');
  const { subscription } = req.body;
  let createdSubscription;

  try {
    validateSubscription(subscription);
    createdSubscription = await subscriptionEntity.create(subscription);
    const response = { success: !!createdSubscription };
    if (createdSubscription) {
      response.subscription = createdSubscription;
      await notify(createdSubscription);
    }
    res.status(OK).json(response);
  } catch (error) {
    if (error instanceof NotificationException) {
      await handleNotifyError(req, res, createdSubscription);
    }
    handleRequestError(res, error, { res, createdSubscription });
  }
}

async function handleNotifyError(req, res, { ID, email }) {
  const logger = Logger.getLog();
  logger.error(`Fail to notify user ${email}`);
  try {
    const subscriptionEntity = db.getEntity('subscription');
    await subscriptionEntity.delete(ID);
    res.status(OK).json({ success: false });
  } catch (error) {
    // TODO: write on queue for post processing
    logger.error(`Fail to deleted user not notified ${ID}`);
    res.status(INTERNAL_ERROR).send('Error on client notification');
  }
}

async function cancel(req, res) {
  const subscriptionEntity = db.getEntity('subscription');
  const { id } = req.params;

  try {
    validateId(id);
    const success = await subscriptionEntity.delete(id);
    const response = { success };

    res.status(OK).json(response);
  } catch (error) {
    handleRequestError(res, error);
  }
}

async function get(req, res) {
  const subscriptionEntity = db.getEntity('subscription');
  const { id } = req.params;

  try {
    validateId(id);
    const subscription = await subscriptionEntity.get(id);
    const response = { success: !!subscription };
    if (subscription) response.subscription = subscription;

    res.status(OK).json(response);
  } catch (error) {
    handleRequestError(res, error);
  }
}

async function getAll(req, res) {
  const subscriptionEntity = db.getEntity('subscription');

  try {
    const subscriptions = await subscriptionEntity.getAll();
    const response = { success: true, subscriptions };
    res.status(OK).json(response);
  } catch (error) {
    handleRequestError(res, error);
  }
}

async function getByEmail(req, res) {
  const subscriptionEntity = db.getEntity('subscription');
  const { email } = req.body;

  try {
    validateEmail(email);
    const subscription = await subscriptionEntity.findOne({ email });
    const response = { success: !!subscription };
    if (subscription) response.subscription = subscription;

    res.status(OK).json(response);
  } catch (error) {
    handleRequestError(res, error);
  }
}

const errorHandlers = [
  {
    is: (error) => error instanceof ValidationException,
    handle: (res, error) => { res.status(BAD_REQUEST).send(error.message); },
  },
  {
    is: (error) => error instanceof DatabaseException,
    handle: (res, error) => { res.status(SERVICE_UNAVAILABLE).send(error.message); },
  },
  {
    is: () => true,
    handle: (res) => { res.status(INTERNAL_ERROR).send('Unexpected error'); },
  },
];

function handleRequestError(res, error) {
  errorHandlers.find((handler) => handler.is(error)).handle(res, error);
}

module.exports = {
  create, cancel, get, getAll, getByEmail,
};

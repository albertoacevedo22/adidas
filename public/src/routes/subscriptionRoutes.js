const express = require('express');

const handlers = require('./handlers/subscriptions');

const basePath = '/subscription';
const router = express.Router();

const create = router.put(basePath, handlers.create);

const check = router.post(`${basePath}/subscribed`, handlers.emailSubscribed);

module.exports = {
  routes: [create, check],
};

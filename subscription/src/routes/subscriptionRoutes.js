const express = require('express');

const handlers = require('./handlers/subscriptions');

const basePath = '/subscription';
const router = express.Router();

const create = router.put(basePath, handlers.create);

const cancel = router.delete(`${basePath}/:id`, handlers.cancel);

const get = router.get(`${basePath}/:id`, handlers.get);

const getAll = router.get(basePath, handlers.getAll);

const getByEmail = router.post(`${basePath}/email`, handlers.getByEmail);

module.exports = {
  routes: [create, cancel, get, getAll, getByEmail],
};

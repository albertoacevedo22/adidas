const SubscriptionRoutes = require('../routes/subscriptionRoutes');

function init(app) {
  const routes = [...SubscriptionRoutes.routes];
  routes.forEach((route) => {
    app.use('/', route);
  });
}

module.exports = {
  init,
};

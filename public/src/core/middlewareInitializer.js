const { CommonMiddleware } = require('../middleware/common');
const { ErrorHandlingMiddleware } = require('../middleware/error');

async function initCommon(app) {
  const middleware = new CommonMiddleware(app);

  await middleware.useBodyParser();
  await middleware.useURLencoded();
  await middleware.useCors();
  await middleware.useHelmet();
  await middleware.logRequests();
}

async function initError(app) {
  const errorMiddleware = new ErrorHandlingMiddleware(app);

  await errorMiddleware.handle404Error();
}

module.exports = {
  initCommon, initError,
};

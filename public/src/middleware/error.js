const { NOT_FOUND } = require('../constants/http');

class ErrorHandlingMiddleware {
  constructor(app) {
    this.app = app;
  }

  async handle404Error() {
    this.app.use((req, resp) => {
      resp.sendStatus(NOT_FOUND);
    });
  }
}

module.exports = {
  ErrorHandlingMiddleware,
};

const { server } = require('./src/core/server');
const { docServer } = require('./docs');

docServer();
server();

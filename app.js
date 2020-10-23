const winston = require('winston');
const config = require('config')
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')(config);
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/joi-objectId-validation')();
 
const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`Server running at port ${port}`));

module.exports = server;

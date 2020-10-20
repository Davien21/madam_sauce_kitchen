const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/joi-objectId-validation')();
 
const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`Server running at port ${port}`));

module.exports = server;

const winston = require('winston');
const express = require('express');
const app = express();

require('express-async-errors');

winston.handleExceptions(
  new winston.transports.Console({ colorize: true, prettyPrint: true }),
  new winston.transports.File({ filename: 'uncaughtExceptions.log'}))
 
process.on('unhandledRejection', (ex)=> {
  throw ex; 
})
winston.add(winston.transports.File, { filename: 'logfile.log' });

require('./startup/db')();

const meals = require('./routes/meals')
const error = require('./middleware/error')

app.use(express.json());
app.use('/api/meals', meals) // use the meals router;
 
//error middleware
app.use(error);

const port = process.env.PORT || 3000;


const server = app.listen(port, () => winston.info(`Server running at port ${port}`));

module.exports = server;






// Set up testing for app.js
// Install and import express
// Create an HTTP Server
// Export app for testing
// Set up a startup folder for running the app
// Set up error logging
// Set up routing
// Set up startup folder
// Set up config / env variables
// Set up middleware: auth, admin, validate, etc.
require('express-async-errors');
const winston = require('winston');
// require('winston-mongodb'); // - if you want to log stuff to db

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log'}))
    
    process.on('unhandledRejection', (ex)=> {
      throw ex; 
    })

  winston.add(winston.transports.File, { filename: 'logfile.log' });
  // winston.add(winston.transports.MongoDB, { 
  //   db: 'mongodb://localhost/madam_sauce_kitchen',
  //   level: 'info'
  // });
}
// - comment out the db transport while running tests
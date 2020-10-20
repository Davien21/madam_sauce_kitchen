const express = require('express');
 
const orders = require('../routes/orders')
const meals = require('../routes/meals')
const admins = require('../routes/admins')
const auth = require('../routes/auth')

const error = require('../middleware/error')

module.exports = function(app) {

  app.use(express.json());
  app.use('/api/orders', orders) // use the orders router;
  app.use('/api/meals', meals) // use the meals router;
  app.use('/api/admins', admins) // use the admins router;
  app.use('/api/auth', auth) // use the auth router;
  
  //error middleware
  app.use(error);

}
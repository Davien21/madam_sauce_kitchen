const config = require('config')
const winston = require('winston');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const db = config.get('db')
mongoose.connect(db,
  { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => winston.info(`Connected to ${db} ...`))

const { Meal } = require('./models/meal')
const meals = express.Router();

meals.post('/api/meals', async (req, res) => {
  res.send({message:'success'})
})

app.use(express.json());
app.use('/', meals);


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
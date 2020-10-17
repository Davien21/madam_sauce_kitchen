const config = require('config')
const winston = require('winston');
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const db = config.get('db')
mongoose.connect(db,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => winston.info(`Connected to ${db} ...`))

const { Meal } = require('./models/meal')
const meals = express.Router();

meals.post('/', (req, res) => {
  if (!req.body.name) return res.status(400).send('name is required')
  if (!req.body.day) return res.status(400).send('A day is required')
  const daysOfTheWeek = [
    'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday', 'sunday'
  ]
  if (!daysOfTheWeek.includes(req.body.day.toLowerCase)) 
    return res.status(400).send('must be a valid day of the week')
})

app.use(express.json());
app.use('/api/meals', meals);


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
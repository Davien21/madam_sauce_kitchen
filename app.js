const jwt = require('jsonwebtoken');
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

const { Meal, validateMeal } = require('./models/meal')

const auth = require('./middleware/auth')

const meals = express.Router();

meals.post('/', auth, async (req, res) => {
  const { error }  = validateMeal(req.body);
	if (error) return res.status(400).send(error.details[0].message);

  let mealInDB = await Meal.lookup(req.body.name, req.body.day)

  if(mealInDB) return res.status(400).send('This Meal already exists')

  let meal = new Meal({
    name: req.body.name,
    day: req.body.day
  })
  meal = await meal.save()

  res.send(meal);
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
const { Meal, validateMeal, sortByDays } = require('../models/meal')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
router.get('/', async (req, res) => {
  let meal = await Meal.find().sort('name')
  meal = sortByDays(meal)
	res.send(meal);
})

router.get('/:day', async (req, res) => {
  const validDays = [
    'monday', 'tuesday', 'wednesday', 
    'thursday', 'friday', 'saturday', 'sunday'
  ]
  if (!validDays.includes(req.params.day)) return res.status(404).send('Invalid day')
  const mealsForTheDay = await Meal.find({ day: req.params.day}).sort('name')
  res.send(mealsForTheDay)
})


router.post('/', [auth, validateBody(validateMeal)], async (req, res) => {
  const mealInDB = await Meal.lookup(req.body.name, req.body.day)

  if(mealInDB) return res.status(400).send('This Meal already exists')

  let meal = new Meal({ name: req.body.name, day: req.body.day.toLowerCase() })
  meal = await meal.save()

  res.send(meal);
})


module.exports = router;

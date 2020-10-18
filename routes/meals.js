const { Meal, validateMeal, sortByDays } = require('../models/meal')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const validateDay = require('../middleware/validateDay')
const validateObjectId = require('../middleware/validateObjectId')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
router.get('/', validateDay, async (req, res) => {
  let meals;
  if (req.query.day) 
    meals = await Meal.find({ day: req.query.day}).sort('name').select('name day')
  
  if (!req.query.day) meals = await Meal.find().sort('name').select('name day')
 
	res.send( sortByDays(meals) );
})

router.get('/:id', validateObjectId, async (req, res) => {
  const meal = await Meal.findById(req.params.id).select('name day')

	if (!meal) return res.status(404).send('Invalid Meal')

  res.send(meal)
})
 
router.post('/', [auth, validateBody(validateMeal)], async (req, res) => {
  const mealInDB = await Meal.lookup(req.body.name, req.body.day)

  if(mealInDB) return res.status(400).send('This Meal already exists')

  let meal = new Meal({ name: req.body.name, day: req.body.day.toLowerCase() })
  meal = await meal.save()

  res.send(meal);
})

router.put('/:id', [auth, validateObjectId, validateBody(validateMeal)], async (req, res) => {
  const meal = await Meal.findByIdAndUpdate(req.params.id, {
    name: req.body.name, day: req.body.day
  }, { new: true })

  if(!meal) return res.status(404).send('Invalid Meal')

  res.send(meal);
})


module.exports = router;

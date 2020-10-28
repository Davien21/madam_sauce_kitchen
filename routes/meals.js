const { Meal, validateMeal, sortByDays } = require('../models/meal')
const _ = require('lodash')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const validateDay = require('../middleware/validateDay')
const validateObjectId = require('../middleware/validateObjectId')

const express = require('express');
const router = express.Router();

router.get('/', validateDay, async (req, res) => {
  let meals;
  if (req.query.day) 
    meals = await Meal.find({ day: req.query.day}).sort('name').select('name day price')
  
  if (!req.query.day) 
    meals = await Meal.find().sort('name').select('name day price')
 
	res.send( sortByDays(meals) );
})

router.get('/:id', validateObjectId, async (req, res) => {
  const meal = await Meal.findById(req.params.id).select('name day price')

	if (!meal) return res.status(404).send('Invalid Meal')

  res.send(meal)
})
 
router.post('/', [auth, validateBody(validateMeal)], async (req, res) => {
  const mealInDB = await Meal.lookup(req.body.name, req.body.day)

  if(mealInDB) return res.status(400).send('This Meal already exists')

  let meal = new Meal( _.pick(req.body, ['name', 'day', 'price']) )
  meal = await meal.save()

  res.send(meal);
})

router.put('/:id', [auth, validateObjectId, validateBody(validateMeal)], async (req, res) => {
  const meal = await Meal.findByIdAndUpdate(req.params.id,
    _.pick(req.body, ['name', 'day', 'price']), { new: true })

  if(!meal) return res.status(404).send('Invalid Meal')

  res.send(meal);
})

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const meal = await Meal.findByIdAndDelete(req.params.id)

  if(!meal) return res.status(404).send('Invalid Meal')

  res.send(meal);
})

module.exports = router;

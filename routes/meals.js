const { Meal, validateMeal } = require('../models/meal')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const express = require('express');
const router = express.Router();

router.post('/', [auth, validateBody(validateMeal)], async (req, res) => {
  const mealInDB = await Meal.lookup(req.body.name, req.body.day)

  if(mealInDB) return res.status(400).send('This Meal already exists')

  let meal = new Meal({ name: req.body.name, day: req.body.day })
  meal = await meal.save()

  res.send(meal);
})



module.exports = router;

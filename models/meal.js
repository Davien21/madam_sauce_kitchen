const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength : 5, 
		maxlength : 50,
  },
  day: {
    type: String,
  }
})

model.Meal = mongoose.model('Meal', model.mealSchema)

module.exports = model;


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

model.mealSchema.statics.lookup = function(name, day) {
  return this.findOne({
    "name": name,
    "day": day
  })
}

model.sortByDays = (mealArray) => {
  order = { sunday: 1, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6, saturday: 7 };
  return mealArray.sort(function (a, b) {
    return order[a.day] - order[b.day];
  });
}

model.Meal = mongoose.model('Meal', model.mealSchema)

model.validateMeal = (meal) => {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    day: Joi.string()
    .valid(
      'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday', 'sunday'
    ).required().insensitive()
  }
	return result = Joi.validate(meal,schema);
} 

module.exports = model;


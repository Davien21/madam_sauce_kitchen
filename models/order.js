const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.order = new mongoose.Schema({
  meal: {
    type : new mongoose.Schema({
      name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50, 
        trim: true,
      },
      day: { 
        type: String, 
        enum: [
          'monday', 'tuesday', 'wednesday', 
          'thursday', 'friday', 'saturday', 'sunday'
        ],
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    }),
    required: true
  },
  customer: {
    type : new mongoose.Schema({
      name: { 
        type : String,   
        required : true, 
        minlength : 5, 
        maxlength : 50
      },
      phone: { 
        type : String,   
        validate : {
          validator : function (v) {
            return v.match(/^(\+234|0)[7-9]\d{9}$/);
          },
          message : 'Must be a valid Nigerian phone number'
        },
        required: true
      }
    }),
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
})

model.order.statics.lookup = function(name, day) {
  return this.findOne({
    "name": name,
    "day": day
  })
}

model.Order = mongoose.model('Order', model.order)

model.validateOrder = (meal) => {
  const schema = {
    mealId: Joi.objectId().required(),
    customer: Joi.object({
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().regex(/^(\+234|0)[7-9]\d{9}$/).required(),
    }).required(),
  }
	return result = Joi.validate(meal,schema);
} 

module.exports = model;


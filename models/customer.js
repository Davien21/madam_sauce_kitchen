const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.Customer = mongoose.model('Customer', new mongoose.Schema({
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
}))

model.validateCustomer = (customer) => {
	const schema = {
    name: Joi.string().trim().min(5).max(50).required(),
    phone: Joi.string().regex(/^(\+234|0)[7-9]\d{9}$/).required(),
	};
	return result = Joi.validate(customer,schema);
}

module.exports = model;
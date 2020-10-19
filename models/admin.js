const config = require('config')
const passwordComplexity = require('joi-password-complexity');

const jwt = require('jsonwebtoken'); 
const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    trim: true,
  },
})

model.adminSchema.methods.generateAuthToken  = function() {
  return token =  jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
}

model.Admin = mongoose.model('Admin', model.adminSchema)

model.validateAdmin = (admin) => {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: new passwordComplexity().required(),
  };
  let result = Joi.validate(admin, schema) 
  if (result.error && result.error.details[0].type === 'passwordComplexity.base')
      result.error.details[0].message = model.customPasswordError
  
  return result;
} 

model.customPasswordError = 
  "Password must have the following:\n"+
  "Min of 8 and max of 26 characters\n"+
  "At least 1 Lowercase, Uppercase letter, number and symbol"

module.exports = model;


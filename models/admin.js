const config = require('config')
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
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: new passwordComplexity().required(),
  };
  return schema.validate(admin, schema);
} 

module.exports = model;


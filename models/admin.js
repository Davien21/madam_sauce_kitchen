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

model.userSchema.methods.generateAuthToken  = function() {
  return token =  jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
}

model.Admin = mongoose.model('Admin', model.adminSchema)


module.exports = model;


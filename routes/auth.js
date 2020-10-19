const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Admin } = require('../models/admin')

const express = require('express');
const validateBody = require('../middleware/validateBody');
const router = express.Router();

router.post('/', validateBody(validate), async (req,res) => {
  let admin =  await Admin.findOne({ email: req.body.email});
  if (!admin) return res.status(400).send('Invalid email or password');
  
  const validPassword =  await bcrypt.compare(req.body.password,admin.password);
  if(!validPassword) return res.status(400).send('Invalid email or password');
	const token = admin.generateAuthToken();
  res.send({authToken: token});
})

validate = (user) => {
	const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: new passwordComplexity().required(),
  });
  return schema.validate(user);
}

module.exports = router;
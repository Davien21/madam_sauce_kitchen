const { Admin, validateAdmin } = require('../models/admin')
const passwordComplexity = require('joi-password-complexity');

const bcrypt = require('bcrypt')
const _ = require('lodash')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const validateObjectId = require('../middleware/validateObjectId')

const express = require('express');
const router = express.Router();
 
router.post('/', [validateBody(validateAdmin)], async (req,res) => {
  let admin =  await Admin.findOne({ email: req.body.email});
  if (admin) return res.status(400).send('Admin already exists');
  
  admin = new Admin(_.pick(req.body,['name','email','password']));
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password,salt);

  await admin.save();
  res.send()
})

module.exports = router;

const { Admin, validateAdmin } = require('../models/admin')

const bcrypt = require('bcrypt')
const _ = require('lodash')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const validateObjectId = require('../middleware/validateObjectId')

const express = require('express');
const router = express.Router();
 

router.get('/', async (req,res) => {
	const admin = await Admin.find().sort('name').select('name')
	res.send(admin);
})

router.get('/:id', validateObjectId, async (req,res) => {
	const admin = await Admin.findOne({ _id : req.params.id }).select('name')
	if (!admin) return res.status(404).send('Invalid Admin'); 
	res.send(admin);
})

router.post('/', [validateBody(validateAdmin)], async (req,res) => {
  let admin =  await Admin.findOne({ email: req.body.email});
  if (admin) return res.status(400).send('Admin already exists');
  
  admin = new Admin(_.pick(req.body,['name','email','password']));
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password,salt);

  await admin.save();
  
  const token =  admin.generateAuthToken();
	res.header('x-auth-token',token).send(_.pick(admin,['_id','name','email']));
})

router.put('/:id', [auth, validateObjectId, validateBody(validateAdmin)], async (req,res) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, 
    _.pick(req.body,['name','email','password']), {	new : true }
  )
  
	if (!admin) return res.status(404).send('Invalid Admin'); 
	res.send(admin);
})

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id)

  if(!admin) return res.status(404).send('Invalid Admin')

  res.send(admin);
})


module.exports = router;

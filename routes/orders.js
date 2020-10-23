const { Order, validateOrder } = require('../models/order')
const { Customer } = require('../models/customer')
const { Meal } = require('../models/meal')
const _ = require('lodash')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const validateObjectId = require('../middleware/validateObjectId')

const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const orders = await Order.find().sort('name')
  res.send(orders);

})

router.get('/:id', auth, validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id)

	if (!order) return res.status(404).send('Invalid Order')

  res.send(order)
})
 
router.post('/', validateBody(validateOrder), async (req, res) => {
  const meal = await Meal.findById(req.body.mealId);
  if (!meal) return res.status(404).send('Invalid Meal'); 
  
  let order = new Order({
    meal: _.pick(meal,['_id', 'name', 'day', 'price']),
    customer: _.pick(req.body.customer,['name', 'phone'])
  })

  order = await order.save()

  res.send(order);
})

router.put('/:id', [auth, validateObjectId, validateBody(validateOrder)], async (req, res) => {
  const meal = await Meal.findById(req.body.mealId);
  if (!meal) return res.status(404).send('meal not found'); 
  
  const order = await Order.findByIdAndUpdate(req.params.id,
    { meal: _.pick(meal,['_id', 'name', 'day', 'price']),
    customer: _.pick(req.body.customer,['name', 'phone'])
  }, { new: true }
  )
  
  if(!order) return res.status(404).send('Invalid Order')

  res.send(order);
})

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id)

  if(!order) return res.status(404).send('Invalid Order')

  res.send(order);
})

module.exports = router;

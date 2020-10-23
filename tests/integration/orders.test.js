const _ = require('lodash')
const { Customer } = require('../../models/customer')
const { Meal } = require('../../models/meal')
const { Order } = require('../../models/order')
const { Admin } = require('../../models/admin')
const request = require('supertest');
const mongoose = require('mongoose')


describe('/api/admins', () => {
  let server = require('../../app')
  beforeEach( async () => { await Order.deleteMany({}) })
  
  afterEach( async () => {
    await server.close(); 
    await Order.deleteMany({})
    
  })
   
  describe('GET /', () => {
    let token;

    beforeEach( async () => {
      await Order.collection.insertMany([
        {
          meal: { name: "chidi", day: "monday", price: 5000 },
          customer: { name: "Jamike Ekennia", phone: "+2347012464621" },
        },
        {
          meal: { name: "chidi", day: "monday", price: 5000 },
          customer: { name: "Jamike Ekennia", phone: "+2347012464621" },
        }
      ])

      token = new Admin().generateAuthToken();
    })

    afterEach( async () => {
      await Order.deleteMany({})

    })
    const exec = () => {
      return request(server)
        .get('/api/orders')
        .set('x-auth-token', token)
    }

    it('should return 401 if not logged in', async () => {
      token = ''

      const res = await exec();

      expect(res.status).toBe(401)
    })

    it(('should return 200 with all orders'), async () => {
      const res = await exec();
      
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2);
      res.body.forEach((order) => {
        expect(order).toHaveProperty('meal')
        expect(order).toHaveProperty('customer')
      })
    })
  })
 
   
  describe('GET /:id', () => {
    let order;
    let orderId;
    let meal;
    let customer;
    let token;

    beforeEach( async () => {
      token = new Admin().generateAuthToken()

      meal = new Meal({ name: 'chidi', day: 'sunday', price: 7500 })
      customer = new Customer({ name: 'chidi', phone: "08036492474" })

      order = order = new Order({
        meal: _.pick(meal,['_id', 'name', 'day', 'price']),
        customer: _.pick(customer,['name', 'phone'])
      })

      orderId = order._id
      await order.save()

    })
    afterEach( async () => {
      await Meal.deleteMany({})
    })
    const exec = async () => {
      return request(server)
      .get('/api/orders/' + orderId)
      .set('x-auth-token', token)
    }
    
    it('should return 401 if not logged in', async () => {
      token = ''

      const res = await exec();

      expect(res.status).toBe(401)
    })

    it('should return 404 if id is invalid', async () => {
      orderId = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    })

        
    it('should return 404 if order with given id does not exist', async () => {
      orderId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    })
    
    it('should return 200 if order with given id exists', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    })
    
    it('should return order in body of the response if id is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('meal');
      expect(res.body).toHaveProperty('customer');
    })
   
  })

  describe('POST /', () => {
    let meal;
    let mealId;
    let customer;

    beforeEach( async () => {
      meal = new Meal({ name: 'chidi', day: 'monday', price: '5000'})
      await meal.save()
      mealId = meal._id

      customer = { name: 'chidi', phone: "08036492474" }
 
    })
    
    const exec = () => {
      return request(server)
        .post('/api/orders')
        .set('x-auth-token', token)
        .send({ mealId, customer })
    }

    it(('should return 400 if mealId is invalid'), async () => {
      mealId = "1";

      const res = await exec();

      expect(res.status).toBe(400);
    })

    it(('should return 400 if customer name is falsy'), async () => {
      customer.name = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if customer phone is falsy'), async () => {
      customer.phone = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 404 if meal is not found'), async () => {
      mealId = mongoose.Types.ObjectId()
      
      const res = await exec();

      expect(res.status).toBe(404)
    })
    
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    
    it(('should save order if inputs are valid'), async () => {
      const res = await exec();

      const orderInDB = await Order.find({ "meal._id": mealId })

      expect(orderInDB).not.toBeNull()
    })
    
    it(('should return order to body of response'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('meal')
      expect(res.body).toHaveProperty('customer')
    })
 
  })
  
  describe('PUT /:id', () => {
    let newCustomer;
    let newMeal;
    let newMealId;
    let order;
    let orderId;
    let token;

    beforeEach( async () => {
      // Before each test we need to create an order and meals and 
      // put it in the database.
      let oldMeal = new Meal({ name: 'banga soup', day: 'sunday', price: '2000'})
      let oldCustomer = new Customer({ name: 'chidi', phone: "08036492474" })
     
      order = new Order({ meal: oldMeal, customer: oldCustomer })
      await order.save()
      
      orderId = order._id

      newMeal = new Meal({ name: 'pizza', day: 'monday', price: '5000'})
      await newMeal.save()
      // These are going to be used for the update:
      newMealId = newMeal._id
      newCustomer = { name: 'chidi', phone: "08036492474" }
      token = new Admin().generateAuthToken()
    })
    
    const exec = () => {
      return request(server)
        .put('/api/orders/' + orderId)
        .set('x-auth-token', token)
        .send({ mealId: newMealId, customer: newCustomer })
    }

    it('should return 401 if not logged in', async () => {
      token = ''

      const res = await exec();

      expect(res.status).toBe(401)
    })

    it(('should return 404 if orderId is invalid'), async () => {
      orderId = "1";

      const res = await exec();

      expect(res.status).toBe(404);
    })

      
    it(('should return 404 if order is not found'), async () => {
      orderId = mongoose.Types.ObjectId();

      const res = await exec();
      
      expect(res.status).toBe(404);
    })

    it(('should return 400 if customer name is falsy'), async () => {
      newCustomer.name = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if customer phone is falsy'), async () => {
      newCustomer.phone = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 404 if meal is not found'), async () => {
      newMealId = mongoose.Types.ObjectId()
      
      const res = await exec();

      expect(res.status).toBe(404)
    })
    
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })

    it(('should update order if inputs are valid'), async () => {
      const res = await exec();

      const orderInDB = await Order.find({ "meal._id": newMealId, "customer.name": 'chidi' })

      expect(orderInDB).not.toBeNull()
    })

    it(('should return order to body of response'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('meal')
      expect(res.body).toHaveProperty('customer')
    })
 
  })
  
  describe('DELETE /:id', () => {
    let order;
    let orderId;
    let token;

    beforeEach( async () => {
      // Before each test we need to create an order and meals and 
      // put it in the database.
      let meal = new Meal({ name: 'banga soup', day: 'sunday', price: '2000'})
      let customer = new Customer({ name: 'chidi', phone: "08036492474" })
     
      order = new Order({ meal, customer })
      await order.save()
      
      orderId = order._id
      token = new Admin().generateAuthToken()
    })
    
    const exec = () => {
      return request(server)
        .delete('/api/orders/' + orderId)
        .set('x-auth-token', token)
        .send()
    }

    it('should return 401 if not logged in', async () => {
      token = ''

      const res = await exec();

      expect(res.status).toBe(401)
    })

    it(('should return 404 if orderId is invalid'), async () => {
      orderId = "1";

      const res = await exec();

      expect(res.status).toBe(404);
    })
 
    it(('should return 404 if order is not found'), async () => {
      orderId = mongoose.Types.ObjectId();

      const res = await exec();
      
      expect(res.status).toBe(404);
    })
    
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    
    it(('should delete order if order exists is valid'), async () => {
      const res = await exec();

      const orderInDB = await Order.findById(orderId)

      expect(orderInDB).toBeNull()
    })

    it(('should return deleted order to body of response'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('meal')
      expect(res.body).toHaveProperty('customer')
    })
 
  })
  
})
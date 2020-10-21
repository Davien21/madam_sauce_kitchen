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
          order: { name: "chidi", day: "monday", price: 5000 },
          customer: { name: "Jamike Ekennia", phone: "+2347012464621" },
        },
        {
          order: { name: "chidi", day: "monday", price: 5000 },
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
        expect(order).toHaveProperty('order')
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

      order = new Order({ meal, customer })
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

})
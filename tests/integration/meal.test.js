const { Meal } = require('../../models/meal')
const { Admin } = require('../../models/admin')
const request = require('supertest');
const mongoose = require('mongoose')

describe('/api/meals', () => {
  let server;
  beforeEach( () => {
    server = require('../../app')
  })
  afterEach( async () => {
    await server.close(); 
    await Meal.remove({})
    
  })
  describe('POST /', () => {
    it(('should return 401 if not logged in'), async () => {
      token = "";
      const res = await request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send()
      expect(res.status).toBe(401)
    })
    it(('should return 400 if name is falsy'), async () => {
      token = new Admin().generateAuthToken();
      
      const res = await request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send()

      expect(res.status).toBe(400)
    })
    it(('should return 400 if day is falsy'), async () => {
      token = new Admin().generateAuthToken();
      
      const res = await request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({name: 'chidi'})

      expect(res.status).toBe(400)
    })
    it(('should return 400 if day is not a valid day of the week'), async () => {
      token = new Admin().generateAuthToken();
      
      const res = await request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({name: 'chidi', day: 'omo'})

      expect(res.status).toBe(400)
    })
    it(('should return 200 if inputs are valid'), async () => {
      token = new Admin().generateAuthToken();
      
      const res = await request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({name: 'chidi', day: 'monday'})

      expect(res.status).toBe(200)
    })
    it(('should save meal if inputs are valid'), async () => {
      token = new Admin().generateAuthToken();

      const mealId = mongoose.Types.ObjectId()
      const res = await request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({_id: mealId,name: 'chidi', day: 'monday'})
  
      const meal = await Meal.findById(mealId)
      expect(meal).not.toBeNull()
      expect(meal).toMatchObject({name: 'chidi', day: 'monday'})
    })
  })

})
// return 401 if not logged in
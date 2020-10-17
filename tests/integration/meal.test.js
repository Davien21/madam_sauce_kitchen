const server = require('../../app')
const { Meal } = require('../../models/meal')
const request = require('supertest');
const mongoose = require('mongoose')

describe('POST /', () => {
  
// Tests for POST
// 400 if name is falsy
// 400 if day is falsy
// 400 if day is not valid day of the week
// 200 if inputs are valid
// save meal to db if inputs are valid

  afterEach( async () => {
    await server.close(); 
  })
  it(('should return 400 if name is falsy'), async () => {
    const res = await request(server)
      .post('/api/meals')
      .send()
    expect(res.status).toBe(400)
  })
  it(('should return 400 if day is falsy'), async () => {
    const res = await request(server)
      .post('/api/meals')
      .send({name: 'chidi'})
    expect(res.status).toBe(400)
  })
  it(('should return 400 if day is not a valid day of the week'), async () => {
    const res = await request(server)
      .post('/api/meals')
      .send({name: 'chidi', day: 'omo'})
    expect(res.status).toBe(400)
  })
  it(('should return 200 if inputs are valid'), async () => {
    const res = await request(server)
      .post('/api/meals')
      .send({name: 'chidi', day: 'monday'})
    expect(res.status).toBe(200)
  })
  it(('should save meal if inputs are valid'), async () => {
    const mealId = mongoose.Types.ObjectId()
    const res = await request(server)
      .post('/api/meals')
      .send({_id: mealId,name: 'chidi', day: 'monday'})

    const meal = await Meal.findById(mealId)
    expect(meal).not.toBeNull()
    expect(meal).toMatchObject({name: 'chidi', day: 'monday'})
  })
})

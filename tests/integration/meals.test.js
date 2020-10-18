const { Meal } = require('../../models/meal')
const { Admin } = require('../../models/admin')
const request = require('supertest');
const mongoose = require('mongoose')

describe('/api/meals', () => {
  let server = require('../../app')
  beforeEach( async () => { await Meal.deleteMany({}) })
  
  afterEach( async () => {
    await server.close(); 
    await Meal.deleteMany({})
    
  })
 
  describe('GET /', () => {
    it(('should return all available meals'), async () => {
      await Meal.collection.insertMany([
        { name: 'banga soup', day: 'friday' },
        { name: 'jellof rice', day: 'tuesday' },
      ])

      const res = await request(server).get('/api/meals')
      
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2);
      res.body.forEach((meal) => {
        expect(meal).toHaveProperty('name', meal.name)
        expect(meal).toHaveProperty('day', meal.day)
      })
    })
  })
  
  describe('GET /:day', () => {
    it('should return 404 if day is invalid', async () => {
      const res = await request(server).get('/api/meals/mahd');

      expect(res.status).toBe(404);
    })
    it('should return 200 if the day is a valid day of the week', async () => {
      const validDays = [
        'monday', 'tuesday', 'wednesday', 
        'thursday', 'friday', 'saturday', 'sunday'
      ]
      validDays.forEach( async (day) => {
        const res = await request(server).get('/api/meals/' + day);
        expect(res.status).toBe(200)
      })

    })
    it('should return meals for that day if input is valid', async () => {
      await Meal.collection.insertMany([
        { name: 'banga soup', day: 'friday' },
        { name: 'jellof rice', day: 'tuesday' },
        { name: 'ofe akwu', day: 'tuesday' },
      ])

      const res = await request(server).get('/api/meals/tuesday');

      expect(res.body.length).toBe(2);
      res.body.forEach((meal) => {
        expect(meal).toHaveProperty('name', meal.name)
        expect(meal).toHaveProperty('day', meal.day)
      })
    
    })
  })

  describe('POST /', () => {
    let token;
    let name;
    let day;
    let meal;

    beforeEach( () => {
      
      name = 'chidi'
      day = 'monday'
      meal = new Meal({
        name,
        day
      })
      token = new Admin().generateAuthToken();
    })
    const exec = () => {
      return request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({ name, day})
    }
    it(('should return 401 if not logged in'), async () => {

      token = "";

      const res = await exec();

      expect(res.status).toBe(401)
    })
    it(('should return 400 if name is falsy'), async () => {
      name = "";

      const res = await exec();

      expect(res.status).toBe(400);
    })
    it(('should return 400 if day is falsy'), async () => {
      day = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })
    it(('should return 400 if day is not a valid day of the week'), async () => {
      day = 'bad day'
      
      const res = await exec();

      expect(res.status).toBe(400)
    })
    it(('should return 400 if meal is already in DB'), async () => {
      await meal.save();

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    it(('should save meal if inputs are valid'), async () => {
      await exec();
  
      const mealInDB = await Meal.lookup(name, day)

      expect(mealInDB).not.toBeNull()
      expect(mealInDB).toMatchObject({name, day})
    })
  })

})
// Remaining tests:
// return 400 if name is less than 5 characters
// return 400 if name is more than 50 characters
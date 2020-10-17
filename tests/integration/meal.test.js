const { Meal } = require('../../models/meal')
const { Admin } = require('../../models/admin')
const request = require('supertest');
const mongoose = require('mongoose')

describe('/api/meals', () => {
  let server;
  let token;
  let name;
  let day;
  let meal;
  let mealId;
  beforeEach( () => {
    server = require('../../app')
    
    name = 'chidi'
    day = 'monday'
    meal = new Meal({
      _id: mealId,
      name,
      day
    })

    token = new Admin().generateAuthToken();
    mealId = mongoose.Types.ObjectId()


  })
  afterEach( async () => {
    await server.close(); 
    await Meal.remove({})
    
  })
  describe('POST /', () => {
    const exec = () => {
      return request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({_id: mealId, name, day})
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
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    it(('should save meal if inputs are valid'), async () => {
      await exec();
  
      const mealInDB = await Meal.findById(mealId)

      expect(mealInDB).not.toBeNull()
      expect(mealInDB).toMatchObject({name: 'chidi', day: 'monday'})
    })
  })

})
// Remaining tests:
// return 400 if name is less than 5 characters
// return 400 if name is more than 50 characters
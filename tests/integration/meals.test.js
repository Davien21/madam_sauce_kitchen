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
        { name: 'banga soup', day: 'friday', price: 3400 },
        { name: 'jellof rice', day: 'tuesday', price: 2100 },
      ])

      const res = await request(server).get('/api/meals')
      
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2);
      res.body.forEach((meal) => {
        expect(meal).toHaveProperty('name', meal.name)
        expect(meal).toHaveProperty('day', meal.day)
        expect(meal).toHaveProperty('price', meal.price)
      })
    })
  })
  
  describe('GET /?day', () => {
    it('should return 400 if day is invalid', async () => {
      const res = await request(server).get('/api/meals/?day=mahd oh');

      expect(res.status).toBe(400);
    })
   
    it('should return meals for that day if input is valid', async () => {

      await Meal.collection.insertMany([
        { name: 'banga soup', day: 'friday', price: 7500 },
        { name: 'jellof rice', day: 'tuesday', price: 8500 },
        { name: 'ofe akwu', day: 'tuesday', price: 9500 },
      ])

      const res = await request(server).get('/api/meals/?day=tuesday');

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2);
      res.body.forEach((meal) => {
        expect(meal).toHaveProperty('name', meal.name)
        expect(meal).toHaveProperty('day', meal.day)
        expect(meal).toHaveProperty('price', meal.price)
      })
    
    })
  })
 
  describe('GET /:id', () => {
    let meal;
    let mealId;

    beforeEach( async () => {
      meal = new Meal({ name: 'chidi', day: 'sunday', price: 7500 })
      mealId = meal._id
      await meal.save()
    })

    const exec = async () => {
      return request(server)
      .get('/api/meals/' + mealId);
    }
    
    it('should return 404 if id is invalid', async () => {
      mealId = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    })
    
    it('should return 404 if meal with given id does not exist', async () => {
      mealId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    })
    
    it('should return 200 if meal with given id exists', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    })
    
    it('should return meal in body of the response if id is valid', async () => {
      const res = await exec();

      expect(res.body).toMatchObject({name: 'chidi', day: 'sunday', price: 7500});
    })
   
  })

  describe('POST /', () => {
    let token;
    let name;
    let day;
    let meal;
    let price;

    beforeEach( () => {
      name = 'chidi'
      day = 'monday'
      price = 7500
      meal = new Meal({ name, day, price })
      token = new Admin().generateAuthToken();
    })

    const exec = () => {
      return request(server)
        .post('/api/meals')
        .set('x-auth-token', token)
        .send({ name, day, price})
    }

    it(('should return 401 if not logged in'), async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401)
    })
    
    it('should return 400 if token is invalid', async () => {
      token = 'a'; 
  
      const res = await exec();
  
      expect(res.status).toBe(400);
    });

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

    it(('should return 400 if price is falsy'), async () => {
      price = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if price is not a valid number'), async () => {
      price = "egoInWords";
      
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
      expect(mealInDB).toMatchObject({name, day, price})
    })
  })
  
  describe('PUT /:id', () => {
    let token;
    let id;
    let newName;
    let newDay;
    let meal;
    let newPrice;

    beforeEach( async () => {
      // Before each test we need to create a meal and 
      // put it in the database.
      meal = new Meal({ name: 'chidi', day: 'monday', price: 1000 })
      await meal.save();
      
      token = new Admin().generateAuthToken();
      id = meal._id
      newName = 'chin-chin'
      newDay = 'sunday'
      newPrice = 5000
    })
    const exec = () => {
      return request(server)
        .put('/api/meals/' + id)
        .set('x-auth-token', token)
        .send({ name: newName, day: newDay, price: newPrice})
    }

    it(('should return 401 if not logged in'), async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401)
    })

    it(('should return 404 if id is invalid'), async () => {
      id = ''

      const res = await exec();

      expect(res.status).toBe(404)
    })

    it(('should return 404 if meal with given id is not found'), async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec();

      expect(res.status).toBe(404)
    })

    it(('should return 400 if name is falsy'), async () => {
      newName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    })

    it(('should return 400 if day is falsy'), async () => {
      newDay = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if day is not a valid day of the week'), async () => {
      newDay = 'bad day'
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if price is falsy'), async () => {
      newDay = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if price is not a number'), async () => {
      newPrice = "moneyNoGoFinish";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })


    it(('should update meal if inputs are valid'), async () => {
      await exec();
      
      const mealInDB = await Meal.lookup(newName, newDay)
      
      expect(mealInDB).not.toBeNull()
      expect(mealInDB).toMatchObject({name: newName, day: newDay, price: newPrice})
    })

    it(('should return meal after update'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
      expect(res.body).toHaveProperty('day', newDay);
      expect(res.body).toHaveProperty('price', newPrice);
    
    })
  
  })

  describe('DELETE /:id', () => {
    let token;
    let meal;
    let id;

    const exec = async () => {
      return await request(server)
       .delete('/api/meals/' + id)
       .set('x-auth-token', token)
       .send()
    }

    beforeEach( async () => {
      // Before each test we need to create a meal and 
      // put it in the database.
      meal = new Meal({ name: 'meal1', day: 'sunday', price: 4000 });
      await meal.save();

      token = new Admin().generateAuthToken();     
      id = meal._id; 
    })
    
    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res =  await exec();
      
      expect(res.status).toBe(401);
    })
   

    it('should return 404 for invalid id', async () => {

      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    })
    
    it('should return 404 if id is valid but meal does not exist', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    })
     
    
    it('should remove meal if id is valid and meal exists', async () => {
      await exec();
      
      const mealInDB = await Meal.findById(meal._id);

      expect(mealInDB).toBeNull();
    })
    
    it('should return the removed meal if input is valid', async () => {
      const res = await exec();
      
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'meal1');
      expect(res.body).toHaveProperty('day', 'sunday');
      expect(res.body).toHaveProperty('price', 4000);
    })
  })

})
 
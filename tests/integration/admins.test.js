const { Admin, customPasswordError } = require('../../models/admin')
const request = require('supertest');


describe('/api/admins', () => {
  let server = require('../../app')
  beforeEach( async () => { await Admin.deleteMany({}) })
  
  afterEach( async () => {
    await server.close(); 
    await Admin.deleteMany({})
    
  })

  describe('POST /', () => {
    let name;
    let email;
    let password;
    let admin;
    beforeEach( async () => {
      name = 'chidiebere ekennia'
      email = 'chidiebereekennia@gmail.com'
      password = 'chidiEBERE123!'
      
      admin = new Admin({
        name, email, password
      })
    })
    const exec = () => {
      return request(server)
        .post('/api/admins')
        .send({ name, email, password })
    }
    it('should return 400 if name is falsy', async () => {
      name = ''

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if email is falsy', async () => {
      email = ''

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if password is falsy', async () => {
      email = ''

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if name is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if name is more than 255 characters', async () => {
      name = new Array(257).join('a')

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if email is invalid', async () => {
      email = 'sauce how far now. u don blow oh';

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if password is invalid', async () => {
      password = 'this password no correct sha';

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if admin already exists', async () => {
      await admin.save()

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should save admin if input is valid', async () => {
      await exec();

      const adminInDB = await Admin.findOne({email})

      expect(adminInDB).toMatchObject({name, email})
    })
    it('should return admin to body of response', async () => {
      const res = await exec();

      expect(res.body).toMatchObject({name, email})
    })
  })
})
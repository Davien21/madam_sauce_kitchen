const { Admin } = require('../../models/admin');
const request = require('supertest');
let server;
const bcrypt = require('bcrypt');

describe('/api/auth/', () => {
  beforeEach(() => { server = require('../../app'); })
  afterEach(async () => { 
    await server.close(); 
    await Admin.deleteMany({})
  });

  describe('POST /', () => {
    
    let token; 
    let admin;
    let email;
    let password;

    beforeEach( async () => {
      // Before each test create an admin and 
      // put in the database.
      const salt = await bcrypt.genSalt(10);
      email = "sinzumoney@gmail.com"
      password = "okEKE123!"
      let hashedPassword = await bcrypt.hash(password, salt);

      admin = new Admin({ name: 'oga emma', email, password: hashedPassword })
      await admin.save()
      
      token = admin.generateAuthToken();
    });

    const exec = () => {
      return request(server)
        .post('/api/auth/')
        .send({ email, password });
    }

    it('should return 400 if email is falsy', async () => {
      email = ''

      const res = await exec();

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is falsy', async () => {
      password = ''

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if admin does not exist', async () => {
      email = 'danielekennia@gmail.com'

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 400 if password does not match', async () => {
      password = 'ezraLikesBoys123!';

      const res = await exec();

      expect(res.status).toBe(400)
    })
    it('should return 200 if admin with given input exists', async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    it('should return auth Token in response body if input is valid', async () => {
      const res = await exec();

      expect(res.body).toMatchObject({authToken: token})
    })
    
  })
})
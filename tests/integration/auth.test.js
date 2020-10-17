const { Admin } = require('../../models/admin');
const request = require('supertest');

describe('auth middleware', () => {
  beforeEach(() => { server = require('../../app'); })
  afterEach(async () => { 
    await server.close(); 
  });

  let token; 

  const exec = () => {
    return request(server)
      .post('/api/meals')
      .set('x-auth-token', token)
      .send({ name: 'chidi', day: 'monday' });
  }

  beforeEach(() => {
    token = new Admin().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a'; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
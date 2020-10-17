const server = require('../../app')
const request = require('supertest');
describe('POST /', () => {
  afterEach( async () => {
    await server.close(); 
  })
  it(('should return 400 if name is falsy'), async () => {
    const res = await request(server)
      .post('/api/meals')
      .send()
    expect(res.status).toBe(400)
  })
})
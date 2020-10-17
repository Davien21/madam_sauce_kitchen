const server = require('../../app')
const request = require('supertest');
describe('POST /', () => {
  afterEach( async () => {
    await server.close(); 
  })
  it(('should return 404 if name is falsy'), async () => {
    const res = await request(server)
      .get('/')
      .send()
    expect(res.status).toBe(404)
  })
})
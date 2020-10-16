const server = require('../../app')
const request = require('supertest');
describe('GET /', () => {
  afterEach( async () => {
    await server.close(); 
  })
  it(('should create an http server'), async () => {
    const res = await request(server)
      .get('/')
      .send()
    expect(res.body).toMatchObject({message:'success'})
  })
})
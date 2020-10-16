const server = require('../../app')
const request = require('supertest');
describe(('GET /', async () => {
  it(('should create an http server'), () => {
    const res = await request(server)
      .get('/')
      .send('success')
    expect(res.body).toBe('success')
  })
}))
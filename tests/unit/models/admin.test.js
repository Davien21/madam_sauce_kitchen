const { Admin } = require('../../../models/admin');
const jwt = require('jsonwebtoken');
const config =  require('config');
const mongoose = require('mongoose');

describe('admin.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString() };
    const token = new Admin(payload).generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    expect(decoded).toMatchObject(payload);

  })
})
 
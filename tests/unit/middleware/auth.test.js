const { Admin } = require('../../../models/admin');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose')
describe('auth middleware', () => {
  let res;
  it('should populate req.admin with the payload of a valid JWT', () => {
    const admin = { 
      _id: mongoose.Types.ObjectId().toHexString(),
    };
    const token = new Admin(admin).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    }
    res = {};
    const next = jest.fn();

    auth(req, res, next);
    
    expect(req.admin).toMatchObject(admin);
  })
})
const error = require('../../../middleware/error')

describe('error middleware', () => {
  it('should return 500', () => {
    const winston = {
      error: jest.fn( (message, err) => {
        
      })
    }
    
    const err = {
      message: jest.fn().mockReturnValue( )
    }
    const res = {
      status: jest.fn( (statusCode) => {
        
      }).mockReturnValue({
        send: jest.fn()
      })
    }

    const req = {};
    const next = jest.fn();

    error(winston)(err, req, res, next)
    
    expect(winston.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status().send).toHaveBeenCalled();
  })
})
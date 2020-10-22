const auth = require('../../../routes/auth');
describe('auth router', () => {
  
  describe('validate user function', () => {
    it('should return an object with error and value properties', () => {
      const user = { email: 'chidi', password: 'chidi4' }
  
      const joiObject = auth.validate(user)

      expect(joiObject).toHaveProperty('error')
      expect(joiObject).toHaveProperty('value')
    })
    
  })
  

  
})
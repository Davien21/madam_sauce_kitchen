const { Customer, validateCustomer } = require('../../../models/customer')

describe('validateCustomer function', () => {
  it('should return an object with error and value properties', () => {
    const customer = { name: 'werey', phone: '+2347012454621' }

    const joiObject = validateCustomer(customer)

    expect(joiObject).toHaveProperty('error')
    expect(joiObject).toHaveProperty('value')
  })
  // consider writing tests for different possible inputs 
})

describe('Customer model', () => {
  
  
  describe(" 'phone' path", () => {
    it('should throw an error for invalid phone input', async () => {
      try {
        customerInput = { name: 'werey', phone: '44012454621' }
        
        const customer = new Customer(customerInput)
        
        await customer.save()
        
      } catch (ex) {
        expect(ex.errors.phone).toBeDefined()
      }
    })

  })
  
  // consider writing tests for different possible inputs 
})
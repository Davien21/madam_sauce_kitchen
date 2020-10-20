require('../../../startup/joi-objectId-validation')()
const { Order, validateOrder } = require('../../../models/order')
const mongoose = require('mongoose')
describe('validateOrder function', () => {
  it('should return an object with error and value properties', () => {
    const order = {
      mealId: mongoose.Types.ObjectId(),
      customer: { name: 'werey', phone: '44012454621' }
    }

    const joiObject = validateOrder(order)

    expect(joiObject).toHaveProperty('error')
    expect(joiObject).toHaveProperty('value')
  })
  
})

describe('Order model', () => {
  
  describe(" 'phone' path", () => {
    it('should throw an error for invalid phone input', async () => {
      try {
        orderInput = {
          mealId: mongoose.Types.ObjectId(),
          customer: { name: 'werey', phone: '44012454621' }
        }
        
        const order = new Order(orderInput)
        
        await order.save()
        
      } catch (ex) {
        expect(ex.errors.customer.errors.phone).toBeDefined()
      }
    })

  })

})
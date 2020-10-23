const configFunction = require('../../../startup/config')

describe('config startup file', () => {
  it("should throw error if jwtPrivateKey is not defined", () => {
    let config = {
      get: jest.fn().mockReturnValue("")
    }

    expect(() => { configFunction(config) }).toThrow()
  })
})
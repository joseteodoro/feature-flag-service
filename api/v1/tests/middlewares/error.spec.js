const error = require('../../src/middlewares/error')

describe.skip(`Middleware error test`, () => {
  context('Some some unexpected error occurs', () => {
    it(`Context must contains error body`, async () => {
      const ctx = {}
      const expectContextResponse = {
        status: 500,
        body: {
          statusCode: 500,
          error: 'INTERNAL',
          message: 'Internal server error',
        },
      }
      const throwUnkownErrorFunction = () => Promise.reject(new Error('Unknown'))
      await error(ctx, throwUnkownErrorFunction)
      expect(ctx).to.be.deep.equals(expectContextResponse)
    })
  })
})

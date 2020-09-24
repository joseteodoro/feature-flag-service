const createTestServer = require('../helpers/server')

describe.skip('server/server suite', () => {
  let request

  beforeEach(async () => {
    request = await createTestServer()
  })

  describe('Given koa server is up', () => {
    it('when I call /health should return 200', () =>
      request.get('/health')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
    )
  })
})

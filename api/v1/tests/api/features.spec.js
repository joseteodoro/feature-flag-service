const sinon = require('sinon')
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')

const API_VERSION = 'v1'

const ENDPOINT = `/api/${API_VERSION}/features`

describe(`features endpoint suite`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  context('When given an unregistered feature', () => {
    it(`Responds with 'resource not found' when finding by name`, () => {
      request.get(`${ENDPOINT}/notfound`)
        .expect(200, errors[catalogue.NOT_FOUND].body)
    })
  })
  context('When given no registered feature', () => {
    it(`Responds with empty when listing by name`, () => {
      request.get(`${ENDPOINT}?mnemonic=banana&enabled=false`)
        .expect(200, { result: [] })
    })
  })
  context('When creating a feature', () => {
    it(`Responds with created`, async () => {
      const feature = {
        mnemonic: 'banana-phone',
        enabled: true,
        author: 'ring ring ring',
      }

      await request
        .post(`${ENDPOINT}`)
        .set('Content-Type', 'application/json')
        .send(feature)
        .expect(201)

      return request.get(`${ENDPOINT}?mnemonic=${feature.mnemonic}`)
        .expect(200)
    })
  })
})

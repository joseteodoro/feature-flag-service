const sinon = require('sinon')
const R = require('ramda')
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')
const idRepo = require('../../src/models/repositories/identifier')

const API_VERSION = 'v1'

describe(`POST /api/${API_VERSION}/identifiers endpoint test`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  const isUUID = R.test(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)

  const post = identifiers =>
    request
      .post(`/api/${API_VERSION}/identifiers`)
      .set('Content-Type', 'application/json')
      .send({ identifiers })

  const expectResponse = R.curry((status, body, response) =>
    response.expect(status, body)
  )

  context('When given valid identifiers', () => {
    it(`Creates person and identifiers and responds with created person mpi`, async () => {
      const identifiers = [
        { type: 'FEDERAL_TAX_ID', value: '11111111111' },
        { type: 'PASSPORT', value: '0x3r3c4' },
      ]

      const mpi = await post(identifiers)
        .expect(200)
        .then(R.path(['body', 'mpi']))

      expect(isUUID(mpi)).to.be.true
      const ids = await idRepo.list({ person_mpi: mpi })
      expect(ids).to.have.length(2)
    })
  })
  context('When given invalid identifiers', () => {
    it(`Responds with 'invalid request' response`, () => {
      const invalid = [
        [{ type: 'blah', value: 'bleh' }],
        [{ type: 'FEDERAL_TAX_ID', value: null }],
        [{ type: 'GENERAL_REGISTRY', value: 'defined', assigner: null }],
      ]

      return Promise.all(invalid.map(post).map(expectResponse(400, errors[catalogue.INVALID_REQUEST].body)))
    })
  })
  context('When identifier is already registered', () => {
    it(`Responds with 'conflict' response`, async () => {
      const ids = [{ type: 'FEDERAL_TAX_ID', value: '12312312312' }]
      await post(ids).expect(200)

      await post(ids).expect(409, errors[catalogue.ID_CONFLICT].body)
    })
  })
})

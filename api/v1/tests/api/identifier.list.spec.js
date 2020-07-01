const sinon = require('sinon')
const uuid = require('uuid').v4
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')

const personRepo = require('../../src/models/repositories/person')
const idRepo = require('../../src/models/repositories/identifier')

const API_VERSION = 'v1'

describe(`GET /api/${API_VERSION}/identifiers/:mpi endpoint test`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  const get = mpi =>
    request.get(`/api/${API_VERSION}/identifiers/${mpi}`)

  const expectResponse = (status, body) => response =>
    response.expect(status, body)

  context('When given an unregistered mpi', () => {
    it(`Responds with 'resource not found' response`, () =>
      get(uuid()).expect(404, errors[catalogue.NOT_FOUND].body)
    )
  })
  context('When given a registered mpi', () => {
    it(`Responds with result set`, async () => {
      const { mpi } = await personRepo.add()
      await idRepo.bulkAdd([
        { person_mpi: mpi, type: 'REGIONAL_MEDICAL_COUNCIL', value: '123123' },
        { person_mpi: mpi, type: 'FEDENRAL_TAX_ID', value: '6'.repeat(11) },
      ])

      return get(mpi).expect(200).expect(r => expect(r.body.result).to.have.length(2))
    })
  })
  context('When given invalid mpi (not uuid)', () => {
    it(`Responds with 'invalid request' response`, () => {
      const invalid = [ '12345', 'abcdefg', '4lph4num3r1c', '@$#!' ]

      return Promise.all(
        invalid.map(get).map(expectResponse(400, errors[catalogue.INVALID_REQUEST].body))
      )
    })
  })
})

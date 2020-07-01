const sinon = require('sinon')
const R = require('ramda')
const uuid = require('uuid').v4
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')
const personRepo = require('../../src/models/repositories/person')
const idRepo = require('../../src/models/repositories/identifier')

const API_VERSION = 'v1'

describe(`PUT /api/${API_VERSION}/identifiers/:mpi endpoint test`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  const put = (mpi, identifiers) =>
    request
      .put(`/api/${API_VERSION}/identifiers/${mpi}`)
      .set('Content-Type', 'application/json')
      .send({ identifiers })

  context('When person is not registered', () => {
    it(`Responds with 'resource not found' response`, () =>
      put(uuid(), [{ type: 'FEDERAL_TAX_ID', value: '9'.repeat(11) }])
        .expect(404, errors[catalogue.NOT_FOUND].body)
    )
  })
  context('When person is registered', () => {
    it('Adds only the new identifiers', async () => {
      const { mpi } = await personRepo.add()
      const savedIdentifiers = [
        { type: 'FEDERAL_TAX_ID', value: '98798798765' },
        { type: 'PASSPORT', value: 'passport' },
      ]
      await idRepo.bulkAdd(savedIdentifiers.map(R.assoc('person_mpi', mpi)))

      const newIdentifiers = [
        savedIdentifiers[0],
        { type: 'REGIONAL_MEDICAL_COUNCIL', value: 'med' },
        { type: 'REGIONAL_NURSING_COUNCIL', value: 'nurse' },
        savedIdentifiers[1],
        { type: 'GENERAL_REGISTRY', value: 'rgsp', assigner: 'SP' },
        { type: 'CIP', value: '12345678', assigner: 'DASA' },
      ]

      await put(mpi, newIdentifiers).expect(204)

      const allIdentifiers = await idRepo.list({ person_mpi: mpi })
      expect(allIdentifiers).to.have.length(6)
    })
  })
})

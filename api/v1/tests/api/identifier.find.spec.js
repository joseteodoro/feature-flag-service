const sinon = require('sinon')
const R = require('ramda')
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')

const identifierRepo = require('../../src/models/repositories/identifier')
const personRepo = require('../../src/models/repositories/person')

const API_VERSION = 'v1'

describe(`GET /api/${API_VERSION}/identifiers?{query} endpoint test`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  const get = ({ type, value }) =>
    request
      .get(`/api/${API_VERSION}/identifiers`)
      .query({ type, value })

  const expectResponse = R.curry((status, body, response) =>
    response.expect(status, body)
  )

  context('When given a valid query', () => {
    context('and there are no matching identifiers registered', () => {
      it('Responds with no content', () =>
        get({ type: 'FEDERAL_TAX_ID', value: '1'.repeat(11) }).expect(204)
      )
    })
    context('and there is a matching identifier registered', () => {
      it('Responds with found identifier', async () => {
        const [type, value] = ['FEDERAL_TAX_ID', '2'.repeat(11)]
        const { mpi } = await personRepo.add()
        const id = { type, value, 'person_mpi': mpi }
        await identifierRepo.bulkAdd([{ type, value, 'person_mpi': mpi }])

        return get({ type, value })
          .expect(200)
          .then(R.prop('body'))
          .then(R.pick(['type', 'value', 'person_mpi']))
          .then(res => expect(res).to.deep.equal(id))
      })
    })
  })
  context('When given an invalid query', () => {
    it(`Responds with 'invalid request' response`, () => {
      const invalid = [
        { },
        { type: '', value: '' },
        { type: 'blah', value: 'bleh' },
        { type: 'FEDERAL_TAX_ID' },
      ]

      return Promise.all(invalid.map(get).map(expectResponse(400, errors[catalogue.INVALID_REQUEST].body)))
    })
  })
})

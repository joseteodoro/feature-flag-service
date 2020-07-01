const sinon = require('sinon')
const createTestServer = require('../helpers/server')
const personRepo = require('../../src/models/repositories/person')
const { catalogue, response: errors } = require('../../src/models/error')

const API_VERSION = 'v1'

describe(`GET /api/${API_VERSION}/mpis/ endpoint test`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })
  const get = ({ page, pageSize }) =>
    request.get(`/api/${API_VERSION}/mpis?page=${page}&pageSize=${pageSize}`)

  context('When missing query parameters page, pageSize or both', () => {
    const missingParameters = { page: 0 }
    it(`Responds with 40X error`, () =>
      get(missingParameters)
        .expect(400, errors[catalogue.INVALID_REQUEST].body)
    )
  })
  context('When given the query parameters page and pageSize', () => {
    context('And does not have any record at database', () => {
      it(`Responds with empty list`, () =>
        get({ page: 0, pageSize: 10 })
          .expect(200)
          .expect(result => expect(result.body).to.have.length(0))
      )
    })
    context('And have records at database', () => {
      it(`Responds records with requested size and page`, async () => {
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()
        await personRepo.add()

        await get({ page: 0, pageSize: 2 })
          .expect(200)
          .expect(result => expect(result.body).to.have.length(2))
        await get({ page: 1, pageSize: 2 })
          .expect(200)
          .expect(result => expect(result.body).to.have.length(2))
        await get({ page: 2, pageSize: 2 })
          .expect(200)
          .expect(result => expect(result.body).to.have.length(2))
        await get({ page: 3, pageSize: 2 })
          .expect(200)
          .expect(result => expect(result.body).to.have.length(2))
        await get({ page: 4, pageSize: 2 })
          .expect(200)
          .expect(result => expect(result.body).to.have.length(1))
      })
    })
  })
})

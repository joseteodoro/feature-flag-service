const uuid = require('uuid').v4
const sinon = require('sinon')
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')

const ENDPOINT = `/api/users`

describe.only(`users endpoint suite`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  context('When given an unregistered users', () => {
    it(`Responds with 'resource not found' when finding unexistent user`, () => {
      return request.get(`/api/v1/users/notfound`)
        .expect(404, errors[catalogue.NOT_FOUND].body)
    })
  })
  context('When posting an user', () => {
    const name = uuid()
    it(`Responds with 'created' when creating`, () => {
      const user = {
        name,
      }
      return request
        .post(`/api/v1/users`)
        .set('Content-Type', 'application/json')
        .send(user)
        .expect(201)
    })
  })
  // context('When given no registered feature', () => {
  //   it(`Responds with empty when listing by name`, () => {
  //     request.get(`${ENDPOINT}?name=banana&enabled=false`)
  //       .expect(200, { result: [] })
  //   })
  // })
  // context('When creating a feature', () => {
  //   it(`Responds with created`, async () => {
  //     const feature = {
  //       name: 'banana-phone',
  //       enabled: true,
  //       author: 'ring ring ring',
  //     }

  //     await request
  //       .post(`${ENDPOINT}`)
  //       .set('Content-Type', 'application/json')
  //       .send(feature)
  //       .expect(201)

  //     return request.get(`${ENDPOINT}?name=${feature.name}`)
  //       .expect(200)
  //   })
  // })
})

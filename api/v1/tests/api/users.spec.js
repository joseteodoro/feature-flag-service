const uuid = require('uuid').v4
const sinon = require('sinon')
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')

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
  context('When creating an user', () => {
    const name = uuid()

    it(`Responds with 'created' when posting`, () => {
      const user = {
        name,
        beta: true,
      }
      return request
        .post(`/api/v1/users`)
        .set('Content-Type', 'application/json')
        .send(user)
        .expect(201)
    })
    it(`Responds with user when looking for the user just created`, () => {
      return request
        .get(`/api/v1/users/${name}`)
        .expect((res) => {
          res.status.should.be.equal(200)
          res.body.should.contain({ name })
        })
    })
    it(`Responds with users when listing`, () => {
      return request
        .get(`/api/v1/users?beta=true`)
        .expect((res) => {
          res.status.should.be.equal(200)
        })
    })
    it(`Responds with users when looking for the user`, () => {
      return request
        .get(`/api/v1/users?name=${name}`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(1)
        })
    })
    it(`Responds with no user when looking for the user not match`, () => {
      return request
        .get(`/api/v1/users?name=${name}&beta=false`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(0)
        })
    })
    it(`Responds with success when putting`, () => {
      const user = {
        name,
        beta: false,
      }
      return request
        .put(`/api/v1/users/${name}`)
        .set('Content-Type', 'application/json')
        .send(user)
        .expect(201)
    })
    it(`Responds with users when looking for the user after update`, () => {
      return request
        .get(`/api/v1/users?name=${name}&beta=false`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(1)
        })
    })
    it(`Responds with flags when looking for the user`, () => {
      return request
        .get(`/api/v1/users/${name}/features`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(0)
        })
    })
  })
  // context('When listing users', () => {
  //   it(`Responds with users`, () => {
  //     return request
  //       .get(`/api/v1/users?beta=true`)
  //       .expect((res) => {
  //         res.status.should.be.equal(200)
  //         console.log(res.body)
  //       })
  //   })
  // })
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

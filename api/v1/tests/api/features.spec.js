const uuid = require('uuid').v4
const sinon = require('sinon')
const createTestServer = require('../helpers/server')
const { catalogue, response: errors } = require('../../src/models/error')
const { TYPES } = require('../../src/models/feature-types')

describe.only(`features endpoint suite`, () => {
  let sandbox, request
  beforeEach(async () => {
    request = await createTestServer()
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })

  context('When given an unregistered feature', () => {
    it(`Responds with 'resource not found' when finding unexistent user`, () => {
      return request.get(`/api/v1/features/notfound`)
        .expect(404, errors[catalogue.NOT_FOUND].body)
    })
  })
  context('When creating an user', () => {
    const feature = uuid()

    it(`Responds with 'created' when posting`, () => {
      const data = {
        feature,
        enabled: true,
        type: TYPES.BOUNCE,
      }
      return request
        .post(`/api/v1/features`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201)
    })
    it(`Responds with features when looking for the feature just created`, () => {
      return request
        .get(`/api/v1/features/${feature}`)
        .expect((res) => {
          res.status.should.be.equal(200)
          res.body.should.contain({ feature })
        })
    })
    it(`Responds with features when listing`, () => {
      return request
        .get(`/api/v1/features?enabled=true`)
        .expect((res) => {
          res.status.should.be.equal(200)
        })
    })
    it(`Responds with users when looking for the feature`, () => {
      return request
        .get(`/api/v1/features?feature=${feature}`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(1)
        })
    })
    it(`Responds with no user when looking for the feature not match`, () => {
      return request
        .get(`/api/v1/features?feature=${feature}&enabled=false`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(0)
        })
    })
    it(`Responds with success when putting`, () => {
      const data = {
        enabled: false,
      }
      return request
        .put(`/api/v1/features/${feature}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201)
    })
    it(`Responds with no user when looking for the feature not match`, () => {
      return request
        .get(`/api/v1/features?feature=${feature}&enabled=false`)
        .expect((res) => {
          res.status.should.be.equal(200)
          expect(Array.isArray(res.body.result)).to.be.true
          expect(res.body.result.length).to.be.equal(0)
        })
    })
    // router.put('/features/:feature/enable', features.enable)
    // router.put('/features/:feature/disable', features.disable)
    describe('when enabling feature', () => {
      it(`Responds with no user when looking for the feature not match`, () => {
        return request
          .get(`/api/v1/features?feature=${feature}&enabled=false`)
          .expect((res) => {
            res.status.should.be.equal(200)
            expect(Array.isArray(res.body.result)).to.be.true
            expect(res.body.result.length).to.be.equal(0)
          })
      })
      it(`Responds with success when enabling`, () => {
        return request
          .put(`/api/v1/features/${feature}/enable`)
          .set('Content-Type', 'application/json')
          .expect(201)
      })
      it(`Responds with user when looking for the feature match`, () => {
        return request
          .get(`/api/v1/features?feature=${feature}&enabled=true`)
          .expect((res) => {
            res.status.should.be.equal(200)
            expect(Array.isArray(res.body.result)).to.be.true
            expect(res.body.result.length).to.be.equal(1)
          })
      })
    })
    describe('when disabling feature', () => {
      it(`Responds with no user when looking for the feature not match`, () => {
        return request
          .get(`/api/v1/features?feature=${feature}&enabled=false`)
          .expect((res) => {
            res.status.should.be.equal(200)
            expect(Array.isArray(res.body.result)).to.be.true
            expect(res.body.result.length).to.be.equal(0)
          })
      })
      it(`Responds with success when disabling`, () => {
        return request
          .put(`/api/v1/features/${feature}/disable`)
          .set('Content-Type', 'application/json')
          .expect(204)
      })
      it(`Responds with user when looking for the feature match`, () => {
        console.log('>>>>>>>>>', { feature })
        return request
          .get(`/api/v1/features?feature=${feature}&enabled=false`)
          .expect((res) => {
            res.status.should.be.equal(200)
            expect(Array.isArray(res.body.result)).to.be.true
            expect(res.body.result.length).to.be.equal(1)
          })
      })
    })

    // it(`Responds with users when looking for the user after update`, () => {
    //   return request
    //     .get(`/api/v1/users?name=${name}&beta=false`)
    //     .expect((res) => {
    //       res.status.should.be.equal(200)
    //       expect(Array.isArray(res.body.result)).to.be.true
    //       expect(res.body.result.length).to.be.equal(1)
    //     })
    // })
    // it(`Responds with flags when looking for the user`, () => {
    //   return request
    //     .get(`/api/v1/features/${name}/features`)
    //     .expect((res) => {
    //       res.status.should.be.equal(200)
    //       expect(Array.isArray(res.body.result)).to.be.true
    //       expect(res.body.result.length).to.be.equal(0)
    //     })
    // })
  })
})

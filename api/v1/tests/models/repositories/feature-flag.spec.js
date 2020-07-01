const sinon = require('sinon')
const repository = require('../../../src/models/repositories/feature-flag')
const models = require('../../../src/models')
const { expect } = require('chai')

describe.only(`feature-flag suite`, () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })
  context('When connected', () => {
    it(`should load`, async () => {
      const id = 1
      const record = await repository.load(id)
      expect(record).to.be.null
    })
    it(`should list feature-flags properly`, async () => {
      const records = await repository.list({ enabled: false })
      expect(records).to.be.deep.equal([])
    })
    it(`should find one feature-flag properly`, async () => {
      const modelSpy = sandbox.spy(models, 'buildMnemonic')
      const user = 'banana'
      const feature = 'banana'
      const record = await repository.findBy({ user, feature }, { enabled: false })
      expect(record).to.be.null
      expect(modelSpy).to.have.been.calledWith({ feature: 'banana', type: undefined, user: 'banana' })
    })
  })
})

const R = require('ramda')
const sinon = require('sinon')
const uuid = require('uuid').v4
const { tag: repository } = require('../../../src/models/repositories')
const { expect } = require('chai')

describe(`feature-tag suite`, () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })
  context('When connected', () => {
    it(`should load`, async () => {
      const ff = {
        feature: uuid(),
        name: uuid(),
      }
      await repository.add(ff)
      const loaded = await repository.findOne(R.pick(['name', 'feature']))
      const record = await repository.load(loaded.id)
      expect(record).to.be.null
    })
    it(`should list feature-flags properly`, async () => {
      const records = await repository.list({ enabled: false })
      expect(records).to.be.deep.equal([])
    })
    it(`should find one feature-flag properly`, async () => {
      const feature = 'banana'
      await repository.list({ feature, enabled: false })
    })
  })
})

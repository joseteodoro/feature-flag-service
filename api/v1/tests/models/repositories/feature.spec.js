const { feature: repository } = require('../../../src/models/repositories')
const uuid = require('uuid').v4

describe(`feature suite`, () => {
  context('When connected', () => {
    it(`should load`, async () => {
      const name = uuid()
      await repository.add({ name, enabled: true })
      const loaded = await repository.findOne({ name })
      expect(loaded).to.not.be.null
    })
    it(`should find one feature properly`, async () => {
      const name = uuid()
      await repository.add({ name })
      await repository.findOne({ name })
    })
    it(`should list features properly`, async () => {
      const records = await repository.list({ name: 'not-found', enabled: false })
      expect(records).to.be.deep.equal([])
    })
  })
})

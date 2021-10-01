const { feature: repository } = require('../../../src/models/repositories')
const uuid = require('uuid').v4

describe(`feature suite`, () => {
  context('When connected', () => {
    it(`should load`, async () => {
      const mnemonic = uuid()
      const createdBy = 'ring ring ring'
      await repository.add({ mnemonic, createdBy, enabled: true })
      const loaded = await repository.findOne(mnemonic)
      const record = await repository.load(loaded.id)
      expect(record).to.not.be.null
    })
    it(`should find one feature properly`, async () => {
      const mnemonic = uuid()
      const createdBy = 'banana'
      await repository.add({ mnemonic, createdBy })
      await repository.findOne(mnemonic, { enabled: false })
    })
    it(`should list features properly`, async () => {
      const records = await repository.list({ enabled: false })
      expect(records).to.be.deep.equal([])
    })
  })
})

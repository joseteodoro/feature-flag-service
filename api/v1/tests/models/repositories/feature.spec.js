const repository = require('../../../src/models/repositories/feature')

describe.only(`feature suite`, () => {
  context('When connected', () => {
    it(`should load`, async () => {
      const id = 1
      const record = await repository.load(id)
      expect(record).to.be.null
    })
    it(`should find one feature properly`, async () => {
      const name = 'banana'
      const record = await repository.findOne(name, { enabled: false })
      expect(record).to.be.null
    })
    it(`should list features properly`, async () => {
      const records = await repository.list({ enabled: false })
      expect(records).to.be.deep.equal([])
    })
  })
})

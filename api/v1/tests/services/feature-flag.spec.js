const sinon = require('sinon')
const service = require('../../src/services/handler')
const repo = require('../../src/models/repositories')
const fakedb = require('./fakedb')

describe.only('verify feature-flags', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    fakedb.setup(sandbox, repo)
  })
  afterEach(() => {
    sandbox.restore()
  })
  describe('for random ones', () => {
    it('should return true if already featured', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[1]
      expect(await service.engine({ feature, user })).to.be.true
    })
    it('should return false for beta tester if we dont need more featured', async () => {
      const { id: user } = fakedb.db.users[2]
      const { id: feature } = fakedb.db.features[1]
      expect(await service.engine({ feature, user })).to.be.false
    })
    it('should return true for beta tester if we need more more featured', async () => {
      const { id: user } = fakedb.db.users[2]
      const { id: feature } = fakedb.db.features[5]
      expect(await service.engine({ feature, user })).to.be.true
    })
    it('should return false if ramdom featured disabled', async () => {
      const { id: user } = fakedb.db.users[3]
      const { id: feature } = fakedb.db.features[5]
      expect(await service.engine({ feature, user })).to.be.false
    })
    it('should return false if random feature disabled', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[8]
      expect(await service.engine({ feature, user })).to.be.false
    })
  })
  describe('for sample ones', () => {
    it('should return true if already featured', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[2]
      expect(await service.engine({ feature, user })).to.be.true
    })
    it('should return false for anyone outside the sample', async () => {
      const { id: user } = fakedb.db.users[2]
      const { id: feature } = fakedb.db.features[6]
      expect(await service.engine({ feature, user })).to.be.false
    })
    it('should return false if sample featured disabled', async () => {
      const { id: user } = fakedb.db.users[3]
      const { id: feature } = fakedb.db.features[6]
      expect(await service.engine({ feature, user })).to.be.false
    })
    it('should return false if sample feature disabled', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[7]
      expect(await service.engine({ feature, user })).to.be.false
    })
  })
  describe('for bounced ones', () => {
    it('should return true if bounce 100%', async () => {
      const { id: feature } = fakedb.db.features[0]
      expect(await service.engine({ feature })).to.be.true
    })
    it('should false true if bounce 0%', async () => {
      const { id: feature } = fakedb.db.features[3]
      expect(await service.engine({ feature })).to.be.false
    })
    it('should return true if bounce 10% and bounced lower than that', async () => {
      const { id: feature } = fakedb.db.features[4]
      expect(await service.engine({ feature, bounce: 5 })).to.be.true
    })
    it('should return false if bounce 10% and bounced greater than that', async () => {
      const { id: feature } = fakedb.db.features[4]
      expect(await service.engine({ feature, bounce: 90 })).to.be.false
    })
    it('should return false if bounced feature disabled', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[9]
      expect(await service.engine({ feature, user })).to.be.false
    })
  })
  describe('for noone ones', () => {
    it('should return false if noone feature', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[10]
      expect(await service.engine({ feature, user })).to.be.false
    })
  })
  describe('for everyone ones', () => {
    it('should return true for everyone feature', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[11]
      expect(await service.engine({ feature, user })).to.be.true
    })
    it('should return false if everyone feature disabled', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[12]
      expect(await service.engine({ feature, user })).to.be.false
    })
  })
  describe('for beta ones', () => {
    it('should return true if beta feature', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[13]
      expect(await service.engine({ feature, user })).to.be.true
    })
    it('should return false if beta feature disabled', async () => {
      const { id: user } = fakedb.db.users[0]
      const { id: feature } = fakedb.db.features[14]
      expect(await service.engine({ feature, user })).to.be.false
    })
  })
})

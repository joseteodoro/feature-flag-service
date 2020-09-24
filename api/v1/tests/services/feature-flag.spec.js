const uuid = require('uuid').v4
const { TYPES } = require('../../src/models/feature-types')

const features = [
  { mnemonic: 0, id: uuid(), feature: 'banana bounced 100%', enabled: true, type: TYPES.BOUNCE, range: 1 },
  { mnemonic: 1, id: uuid(), feature: 'banana random', enabled: true, type: TYPES.RANDOM, range: 0.1 },
  { mnemonic: 2, id: uuid(), feature: 'banana sample', enabled: true, type: TYPES.SAMPLE },
  { mnemonic: 3, id: uuid(), feature: 'banana bounced 0%', enabled: true, type: TYPES.BOUNCE, range: 0 },
  { mnemonic: 4, id: uuid(), feature: 'banana bounced 10%', enabled: true, type: TYPES.BOUNCE, range: 0.1 },
  { mnemonic: 5, id: uuid(), feature: 'banana random', enabled: true, type: TYPES.RANDOM, range: 0.9 },
  { mnemonic: 6, id: uuid(), feature: 'banana sample 100%', enabled: true, type: TYPES.SAMPLE, range: 1 },
  { mnemonic: 7, id: uuid(), feature: 'disabled banana sample 100%', enabled: false, type: TYPES.SAMPLE, range: 1 },
  { mnemonic: 8, id: uuid(), feature: 'disabled banana random', enabled: false, type: TYPES.RANDOM, range: 1 },
  { mnemonic: 9, id: uuid(), feature: 'disabled banana bounced 100%', enabled: false, type: TYPES.BOUNCE, range: 1 },
  { mnemonic: 10, id: uuid(), feature: 'noone banana', enabled: true, type: TYPES.NO_ONE, range: 1 },
  { mnemonic: 11, id: uuid(), feature: 'everyone banana 100%', enabled: true, type: TYPES.EVERYONE, range: 1 },
  { mnemonic: 12, id: uuid(), feature: 'disabled everyone banana 100%', enabled: false, type: TYPES.EVERYONE, range: 1 },
  { mnemonic: 13, id: uuid(), feature: 'beta banana 100%', enabled: true, type: TYPES.BETA, range: 1 },
  { mnemonic: 14, id: uuid(), feature: 'disabled beta banana 100%', enabled: false, type: TYPES.BETA, range: 1 },
]

const users = [
  { id: uuid(), name: 'lab do joaquim', beta: true },
  { id: uuid(), name: 'lab do bacana', beta: true },
  { id: uuid(), name: 'lab do bambu', beta: true },
  { id: uuid(), name: 'lab do disabled', beta: true },
]

const db = {
  features,
  users,
  featured: [
    { feature: features[0].id, user: users[0].id, enabled: true },
    { feature: features[1].id, user: users[0].id, enabled: true },
    { feature: features[2].id, user: users[0].id, enabled: true },
    { feature: features[6].id, user: users[1].id, enabled: false },
    { feature: features[7].id, user: users[0].id, enabled: false },
    { feature: features[0].id, user: users[3].id, enabled: false },
    { feature: features[6].id, user: users[3].id, enabled: false },
    { feature: features[5].id, user: users[3].id, enabled: false },
    { feature: features[7].id, user: users[0].id, enabled: false },
    { feature: features[8].id, user: users[0].id, enabled: false },
    { feature: features[9].id, user: users[0].id, enabled: false },
  ],
}

// db functions

const isFeatured = async (us, ft) => !!db.featured.find(({ user, feature }) => user === us && feature === ft)

const isFeaturedEnabled = async (us, ft) => !!db.featured.find(({ user, feature, enabled }) => user === us && feature === ft && enabled)

const countFeatured = async (ft) => db.featured.filter(({ feature }) => feature === ft).length

const findFeature = async (ft) => db.features.find(({ id }) => id === ft)

const findUser = async (us) => db.users.find(({ id }) => id === us)

const addFeatured = async (user, feature) => db.featured.push({ feature, user })

const countUsers = async () => db.users.length

const service = {
  isFeatured,
  countFeatured,
  findFeature,
  findUser,
  addFeatured,
  countUsers,
}

// end of db

const needMoreUsers = async (featured, feature, userCount) => {
  return {
    featured,
    range: feature.range,
    userCount,
    needMore: featured < feature.range * userCount,
  }
}

const hydratateFeatureData = (ft) => {
  return Promise.all([
    service.countUsers(),
    service.findFeature(ft),
    service.countFeatured(ft),
  ])
}

const shouldAddMore = async (ft) => {
  return hydratateFeatureData(ft)
    .then(([userCount, feature, featured]) => {
      return needMoreUsers(featured, feature, userCount)
    })
}

const rand = async ({ range }) => Math.random() <= range

const truthy = async () => true

const addBetaOrRand = (user, feature, needMore) => loadedUser => {
  if (!loadedUser.beta && !rand(needMore)) return false
  return service.addFeatured(user, feature)
    .then(truthy)
}

const randomAdd = (user, feature) => async (needMore) => {
  return needMore.needMore
    ? service.findUser(user)
      .then(addBetaOrRand(user, feature, needMore))
    : false
}

const addIfNeeded = (user, feature) => featured => {
  return featured
    ? isFeaturedEnabled(user, feature)
    : shouldAddMore(feature)
      .then(randomAdd(user, feature))
}

const randomEngine = async ({ user, feature }) => {
  return service.isFeatured(user, feature)
    .then(addIfNeeded(user, feature))
}

const sampleEngine = async ({ user, feature }) => {
  return service.isFeatured(user, feature)
    .then(featured => featured && isFeaturedEnabled(user, feature))
}

const addIfBeta = (user, feature) => featured => {
  const forceBetaUsers = { range: -1, needMore: true }
  return featured
    ? isFeaturedEnabled(user, feature)
    : service.findUser(user)
      .then(addBetaOrRand(user, feature, forceBetaUsers))
}

const betaEngine = async ({ user, feature }) => {
  return service.isFeatured(user, feature)
    .then(addIfBeta(user, feature))
}

const defaultBounce = () => Math.random() * 100

const bounceLimit = bounce => feature => bounce <= (feature.range * 100)

const bouncedEngine = async ({ feature, bounce = defaultBounce() }) => {
  return service.findFeature(feature)
    .then(bounceLimit(bounce))
}

const falsy = async () => false

const engines = {
  [TYPES.BOUNCE]: bouncedEngine,
  [TYPES.RANDOM]: randomEngine,
  [TYPES.SAMPLE]: sampleEngine,
  [TYPES.EVERYONE]: truthy,
  [TYPES.BETA]: betaEngine,
  [TYPES.NO_ONE]: falsy,
}

const engineByType = ({ type, enabled }) => {
  if (enabled) {
    return engines[type] || bouncedEngine
  }
  return falsy
}

const engineByFeature = (ft) => service.findFeature(ft)
  .then(engineByType)

const invoke = args => fn => fn(args)

const engine = ({ feature, bounce, user }) => engineByFeature(feature)
  .then(invoke({ feature, bounce, user }))

// tests

describe.only('verify feature-flags', () => {
  describe('for random ones', () => {
    it('should return true if already featured', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[1]
      expect(await engine({ feature, user })).to.be.true
    })
    it('should return false for beta tester if we dont need more featured', async () => {
      const { id: user } = db.users[2]
      const { id: feature } = db.features[1]
      expect(await engine({ feature, user })).to.be.false
    })
    it('should return true for beta tester if we need more more featured', async () => {
      const { id: user } = db.users[2]
      const { id: feature } = db.features[5]
      expect(await engine({ feature, user })).to.be.true
    })
    it('should return false if ramdom featured disabled', async () => {
      const { id: user } = db.users[3]
      const { id: feature } = db.features[5]
      expect(await engine({ feature, user })).to.be.false
    })
    it('should return false if random feature disabled', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[8]
      expect(await engine({ feature, user })).to.be.false
    })
  })
  describe('for sample ones', () => {
    it('should return true if already featured', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[2]
      expect(await engine({ feature, user })).to.be.true
    })
    it('should return false for anyone outside the sample', async () => {
      const { id: user } = db.users[2]
      const { id: feature } = db.features[6]
      expect(await engine({ feature, user })).to.be.false
    })
    it('should return false if sample featured disabled', async () => {
      const { id: user } = db.users[3]
      const { id: feature } = db.features[6]
      expect(await engine({ feature, user })).to.be.false
    })
    it('should return false if sample feature disabled', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[7]
      expect(await engine({ feature, user })).to.be.false
    })
  })
  describe('for bounced ones', () => {
    it('should return true if bounce 100%', async () => {
      const { id: feature } = db.features[0]
      expect(await engine({ feature })).to.be.true
    })
    it('should false true if bounce 0%', async () => {
      const { id: feature } = db.features[3]
      expect(await engine({ feature })).to.be.false
    })
    it('should return true if bounce 10% and bounced lower than that', async () => {
      const { id: feature } = db.features[4]
      expect(await engine({ feature, bounce: 5 })).to.be.true
    })
    it('should return false if bounce 10% and bounced greater than that', async () => {
      const { id: feature } = db.features[4]
      expect(await engine({ feature, bounce: 90 })).to.be.false
    })
    it('should return false if bounced feature disabled', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[9]
      expect(await engine({ feature, user })).to.be.false
    })
  })
  describe('for noone ones', () => {
    it('should return false if noone feature', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[10]
      expect(await engine({ feature, user })).to.be.false
    })
  })
  describe('for everyone ones', () => {
    it('should return true for everyone feature', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[11]
      expect(await engine({ feature, user })).to.be.true
    })
    it('should return false if everyone feature disabled', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[12]
      expect(await engine({ feature, user })).to.be.false
    })
  })
  describe('for beta ones', () => {
    it('should return true if beta feature', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[13]
      expect(await engine({ feature, user })).to.be.true
    })
    it('should return false if beta feature disabled', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[14]
      expect(await engine({ feature, user })).to.be.false
    })
  })
})

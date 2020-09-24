const uuid = require('uuid').v4

const FEATURE_TYPES = {
  BOUNCE: 'BOUNCE',
  SAMPLE: 'SAMPLE',
  RANDOM: 'RANDOM',
}

const features = [
  { id: uuid(), feature: 'banana bounced 100%', enabled: true, type: FEATURE_TYPES.BOUNCE, range: 1 },
  { id: uuid(), feature: 'banana random', enabled: true, type: FEATURE_TYPES.RANDOM, range: 0.3 },
  { id: uuid(), feature: 'banana sample', enabled: true, type: FEATURE_TYPES.SAMPLE },
  { id: uuid(), feature: 'banana bounced 0%', enabled: true, type: FEATURE_TYPES.BOUNCE, range: 0 },
  { id: uuid(), feature: 'banana bounced 10%', enabled: true, type: FEATURE_TYPES.BOUNCE, range: 0.1 },
  { id: uuid(), feature: 'banana random', enabled: true, type: FEATURE_TYPES.RANDOM, range: 0.9 },
  { id: uuid(), feature: 'banana sample 100%', enabled: true, type: FEATURE_TYPES.SAMPLE, range: 1 },
]

const users = [
  { id: uuid(), name: 'lab do joaquim', beta: true },
  { id: uuid(), name: 'lab do bacana', beta: true },
  { id: uuid(), name: 'lab do bambu', beta: true },
]

const db = {
  features,
  users,
  featured: [
    { feature: features[0].id, user: users[0].id },
    { feature: features[1].id, user: users[0].id },
    { feature: features[2].id, user: users[0].id },
  ],
}

// db functions

const isFeatured = async (us, ft) => !!db.featured.find(({ user, feature }) => user === us && feature === ft)

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

const shouldAddMore = async (ft) => {
  return service.countUsers()
    .then(userCount => {
      return service.findFeature(ft)
        .then(loaded => {
          return service.countFeatured(ft)
            .then(featured => {
              return needMoreUsers(featured, loaded, userCount)
            })
        })
    })
}

const rand = async ({ range }) => Math.random() <= range

const randomAdd = (user, feature) => async (needMore) => {
  if (!needMore.needMore) {
    return false
  }
  return service.findUser(user)
    .then(loadedUser => {
      if (!loadedUser.beta && !rand(needMore)) return false
      return service.addFeatured(user, feature)
        .then(() => true)
    })
}

const randomEngine = async ({ user, feature }) => {
  return service.isFeatured(user, feature)
    .then(featured => featured || shouldAddMore(feature)
      .then(randomAdd(user, feature))
    )
}

const sampleEngine = async ({ user, feature }) => {
  return service.isFeatured(user, feature)
}

const defaultBounce = () => Math.random() * 100

const bouncedEngine = async ({ feature, bounce = defaultBounce() }) => {
  return service.findFeature(feature)
    .then(loaded => {
      return bounce <= (loaded.range * 100)
    })
}

const engines = {
  [FEATURE_TYPES.BOUNCE]: bouncedEngine,
  [FEATURE_TYPES.RANDOM]: randomEngine,
  [FEATURE_TYPES.SAMPLE]: sampleEngine,
}

const engineByFeature = (ft) => {
  return service.findFeature(ft)
    .then(feature => engines[feature.type] || bouncedEngine)
}

const engine = ({ feature, bounce, user }) => {
  return engineByFeature(feature)
    .then(run => run({ feature, bounce, user }))
}

describe.only('verify feature-flags', () => {
  describe('for random ones', () => {
    it('should return true if already featured', async () => {
      const { id: user } = db.users[0]
      const { id: feature } = db.features[1]
      expect(await engine({ feature, user })).to.be.true
    })
    it('should return false for beta tester if we dont need more more featured', async () => {
      const { id: user } = db.users[2]
      const { id: feature } = db.features[1]
      expect(await engine({ feature, user })).to.be.false
    })
    it('should return true for beta tester if we need more more featured', async () => {
      const { id: user } = db.users[2]
      const { id: feature } = db.features[5]
      expect(await engine({ feature, user })).to.be.true
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
    it('should return true if bounce 10% and bounced greater than that', async () => {
      const { id: feature } = db.features[4]
      expect(await engine({ feature, bounce: 90 })).to.be.false
    })
  })
})
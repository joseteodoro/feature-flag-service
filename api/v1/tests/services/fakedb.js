const uuid = require('uuid').v4
const { TYPES } = require('../../src/models/feature-types')

const features = [
  { mnemonic: 0, id: uuid(), feature: 'banana bounced 100%', enabled: true, type: TYPES.BOUNCE, range: 100 },
  { mnemonic: 1, id: uuid(), feature: 'banana random', enabled: true, type: TYPES.RANDOM, range: 10 },
  { mnemonic: 2, id: uuid(), feature: 'banana sample', enabled: true, type: TYPES.SAMPLE },
  { mnemonic: 3, id: uuid(), feature: 'banana bounced 0%', enabled: true, type: TYPES.BOUNCE, range: 0 },
  { mnemonic: 4, id: uuid(), feature: 'banana bounced 10%', enabled: true, type: TYPES.BOUNCE, range: 10 },
  { mnemonic: 5, id: uuid(), feature: 'banana random', enabled: true, type: TYPES.RANDOM, range: 90 },
  { mnemonic: 6, id: uuid(), feature: 'banana sample 100%', enabled: true, type: TYPES.SAMPLE, range: 100 },
  { mnemonic: 7, id: uuid(), feature: 'disabled banana sample 100%', enabled: false, type: TYPES.SAMPLE, range: 100 },
  { mnemonic: 8, id: uuid(), feature: 'disabled banana random', enabled: false, type: TYPES.RANDOM, range: 100 },
  { mnemonic: 9, id: uuid(), feature: 'disabled banana bounced 100%', enabled: false, type: TYPES.BOUNCE, range: 100 },
  { mnemonic: 10, id: uuid(), feature: 'noone banana', enabled: true, type: TYPES.NO_ONE, range: 100 },
  { mnemonic: 11, id: uuid(), feature: 'everyone banana 100%', enabled: true, type: TYPES.EVERYONE, range: 100 },
  { mnemonic: 12, id: uuid(), feature: 'disabled everyone banana 100%', enabled: false, type: TYPES.EVERYONE, range: 100 },
  { mnemonic: 13, id: uuid(), feature: 'beta banana 100%', enabled: true, type: TYPES.BETA, range: 100 },
  { mnemonic: 14, id: uuid(), feature: 'disabled beta banana 100%', enabled: false, type: TYPES.BETA, range: 100 },
]

const users = [
  { id: uuid(), name: 'lab do joaquim', beta: true },
  { id: uuid(), name: 'lab do bacana', beta: true },
  { id: uuid(), name: 'lab do bambu', beta: true },
  { id: uuid(), name: 'lab do disabled', beta: false },
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

const setup = (sandbox, repo) => {
  sandbox.stub(repo, 'isFeatured').callsFake(isFeatured)
  sandbox.stub(repo, 'isFeaturedEnabled').callsFake(isFeaturedEnabled)
  sandbox.stub(repo, 'countFeatured').callsFake(countFeatured)
  sandbox.stub(repo, 'findFeature').callsFake(findFeature)
  sandbox.stub(repo, 'findUser').callsFake(findUser)
  sandbox.stub(repo, 'addFeatured').callsFake(addFeatured)
  sandbox.stub(repo, 'countUsers').callsFake(countUsers)
}

module.exports = {
  isFeatured,
  isFeaturedEnabled,
  countFeatured,
  findFeature,
  findUser,
  addFeatured,
  countUsers,
  db,
  setup,
}

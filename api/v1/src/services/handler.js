const { TYPES } = require('../../src/models/feature-types')
const db = require('../models/repositories')

const needMoreUsers = async (featured, feature, userCount) => {
  return {
    featured,
    range: feature.range,
    userCount,
    needMore: featured < (feature.range / 100) * userCount,
  }
}

const hydratateFeatureData = (ft) => {
  return Promise.all([
    db.countUsers(),
    db.findFeature(ft),
    db.countFeatured(ft),
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
  return db.addFeatured(user, feature)
    .then(truthy)
}

const randomAdd = (user, feature) => async (needMore) => {
  return needMore.needMore
    ? db.findUser(user)
      .then(addBetaOrRand(user, feature, needMore))
    : false
}

const addIfNeeded = (user, feature) => featured => {
  return featured
    ? db.isFeaturedEnabled(user, feature)
    : shouldAddMore(feature)
      .then(randomAdd(user, feature))
}

const randomEngine = async ({ user, feature }) => {
  return db.isFeatured(user, feature)
    .then(addIfNeeded(user, feature))
}

const sampleEngine = async ({ user, feature }) => {
  return db.isFeatured(user, feature)
    .then(featured => featured && db.isFeaturedEnabled(user, feature))
}

const addIfBeta = (user, feature) => featured => {
  const forceBetaUsers = { range: -1, needMore: true }
  return featured
    ? db.isFeaturedEnabled(user, feature)
    : db.findUser(user)
      .then(addBetaOrRand(user, feature, forceBetaUsers))
}

const betaEngine = async ({ user, feature }) => {
  return db.isFeatured(user, feature)
    .then(addIfBeta(user, feature))
}

const defaultBounce = () => Math.random() * 100

const bounceLimit = bounce => feature => bounce <= feature.range

const bouncedEngine = async ({ feature, bounce = defaultBounce() }) => {
  return db.findFeature(feature)
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

const engineByFeature = (ft) => db.findFeature(ft)
  .then(engineByType)

const invoke = args => fn => fn(args)

const engine = ({ feature, bounce, user }) => engineByFeature(feature)
  .then(invoke({ feature, bounce, user }))

module.exports = { engine }

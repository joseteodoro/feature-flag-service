const uuid = require('uuid').v4
const { Feature, Featured, Users } = require('../entities')

const countFeatured = async (ft) => db.featured.filter(({ feature }) => feature === ft).length

const countUsers = async () => db.users.length

const addFeatured = async (user, feature) => Featured()
  .then(model => model.create({
    user,
    feature,
    enabled: true,
    id: uuid(),
  }))

const isFeaturedEnabled = async (user, feature) => Featured()
  .then(model => !!model.findOne({ where: { user, feature, enabled: true } }))

const findFeature = async (feature) => Feature()
  .then(model => model.findOne({ where: { id: feature } }))

const findUser = async (user) => Users()
  .then(model => model.findOne({ where: { id: user } }))

const isFeatured = async (user, feature) => Featured()
  .then(model => !!model.findOne({ where: { user, feature } }))

const repo = {
  isFeatured,
  countFeatured,
  findFeature,
  findUser,
  addFeatured,
  countUsers,
  isFeaturedEnabled,
}

module.exports = repo

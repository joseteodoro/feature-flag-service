const R = require('ramda')
const repository = require('../models/repositories')

const create = R.when(
  R.not,
  repository.feature.add
)

const safeAuthor = author => author && ({ createdBy: author })

const listFeatures = ({ author, enabled = true, page = 0, pageSize = 10 }) => {
  const offset = page * pageSize
  const limit = pageSize
  const where = { enabled, ...safeAuthor(author) }
  return repository.feature.list({where, limit, offset})
}

const findFeature = (mnemonic, { author, enabled = true }) =>
  repository.feature.findOne(mnemonic, { enabled, ...safeAuthor(author) })

const update = repo => (mnemonic, args) => repo.feature.findOne(mnemonic, args)

const updateFeature = update(repository.feature)

const addFeature = feature =>
  repository.feature.findOne(feature.mnemonic)
    .then(() => updateFeature(feature.mnemonic, { ...feature }))
    .catch(create)

const updateFeatureFlag = update(repository.feature)

module.exports = {
  listFeatures,
  findFeature,
  updateFeature,
  addFeature,
  updateFeatureFlag,
}

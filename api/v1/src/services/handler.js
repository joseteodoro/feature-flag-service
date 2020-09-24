const R = require('ramda')
const TYPES = require('../models/feature-types')
const repo = require('../models/repositories')

const handleFoundBeta = R.allPass([
  R.complement(R.isNil),
  R.complement(R.isEmpty),
  ({ enabled }) => enabled,
])

const shouldAddTag = feature => repo.tag.list(feature)
  .then(tags => repo.feature.findOne(feature)
    .then(loaded => tags.length < loaded.span)
  )
  .catch(() => false)

const handleBeta = (_, tag) => repo.beta.findOne(tag)
  .catch(() => ({})) //by pass with empty
  .then(handleFoundBeta)

const random = feature => repo.feature.findOne(feature)
  .then(loaded => Math.random() < (loaded.span / 100))
  .catch(() => false)

const tryEnableTag = (feature, tag) => enabled => !enabled
  ? false
  : shouldAddTag(feature)
    .then(should => should ? repo.tag.add({ name: tag, feature, enabled: true }) : false)

const handleNonExistentFeatureTag = (feature, tag) => () => random(feature, tag)
  .then(tryEnableTag(feature, tag))

const randomTag = (feature, tag) => repo.tag.findOne(feature, tag)
  .then(R.prop('enabled'))
  .catch(handleNonExistentFeatureTag(feature, tag))

const handleRandom = (feature, tag) => R.isNill(tag)
  ? random(feature)
  : randomTag(feature, tag)

const findTag = (feature, tag) => repo.tag.findOne(feature, tag)
  .then(R.prop('enabled'))
  .catch(() => false)

const handlers = {
  [TYPES.NO_ONE]: () => false,
  [TYPES.EVERYONE]: () => true,
  [TYPES.SOME_ONE]: findTag,
  [TYPES.BETA]: handleBeta,
  [TYPES.RANDOM]: handleRandom,
}

const handle = ({ feature, tag }) => repo.feature.findOne(feature)
  .catch(() => ({ type: TYPES.NO_ONE }))
  .then(loaded => handlers[loaded.type](feature, tag))

module.exports = { handle }

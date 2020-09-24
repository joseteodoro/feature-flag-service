const R = require('ramda')
const common = require('./common')
const TYPES = require('../feature-types')
const { Feature, FeatureTag, Beta } = require('../entities')

const loadFeatureModel = () => Promise.resolve(Feature())

const loadFeatureTagModel = () => Promise.resolve(FeatureTag())

const loadBetaModel = () => Promise.resolve(Beta())

const addFeature = common.add(loadFeatureModel)

const findFeature = common.findOne(loadFeatureModel)

const findTag = ({feature, name}) => common.findOne(loadFeatureTagModel)(name, { feature })

const addTag = ({feature, name}) => () => findTag({feature, name})
  .catch(() => common.add(loadFeatureTagModel)({
    feature,
    name,
    enabled: true,
  }))

const addFeatureTag = ({feature, tag}) => findFeature(feature)
  .catch(() => addFeature({
    name: feature,
    enabled: true,
    allow: TYPES.SOME_ONE,
  }))
  .then(addTag({feature, tag}))

module.exports = {
  feature: {
    add: addFeature,
    findOne: findFeature,
    list: common.list(loadFeatureModel),
    update: common.update(loadFeatureModel),
    disable: R.pipe(findFeature, R.then(common.disable)),
    enable: R.pipe(findFeature, R.then(common.enable)),
  },
  tag: {
    add: addFeatureTag,
    findOne: findTag,
    list: common.list(loadFeatureTagModel),
    disable: R.pipe(findTag, R.then(common.disable)),
    enable: R.pipe(findTag, R.then(common.enable)),
  },
  beta: {
    add: common.add(loadBetaModel),
    findOne: common.findOne(loadBetaModel),
    list: common.list(loadBetaModel),
    disable: R.pipe(common.findOne(loadBetaModel), R.then(common.disable)),
    enable: R.pipe(common.findOne(loadBetaModel), R.then(common.enable)),
  },
}

const common = require('./common')

const { Feature, FeatureFlag } = require('../entities')

const loadFeatureModel = () => Promise.resolve(Feature())

const loadFeatureFlagModel = () => Promise.resolve(FeatureFlag())

const feature = {
  bulkAdd: common.bulkAdd(loadFeatureModel),
  add: common.add(loadFeatureModel),
  findOne: common.findOne(loadFeatureModel),
  load: common.load(loadFeatureModel),
  list: common.list(loadFeatureModel),
  update: common.update(loadFeatureModel),
}

const addFFWithDependency = (ff, f) => {
  ff.feature = f
  return FeatureFlag.create(ff)
}

const addFeatureFlag = ({ feature, ...rest }, { cascade = true }) =>
  common.findOne(loadFeatureFlagModel)
    .catch(() =>  feature.findOne(feature)
      .then(f => addFFWithDependency(rest, f))
      .catch(error => {
        return cascade
          ? feature.add( add feature aqui e volta com a entidade pra salvar ff)
          : Promise.reject(error)
      })
    )



const featureFlag = {
  bulkAdd: common.bulkAdd(loadFeatureFlagModel),
  add: common.add(loadFeatureFlagModel),
  findOne: common.findOne(loadFeatureFlagModel),
  load: common.load(loadFeatureFlagModel),
  list: common.list(loadFeatureFlagModel),
  update: common.update(loadFeatureFlagModel),
}

module.exports = {
  feature,
  featureFlag,
}

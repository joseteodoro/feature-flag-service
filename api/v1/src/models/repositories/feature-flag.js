const { FeatureFlag } = require('../entities')
const models = require('../')

const loadModel = () => Promise.resolve(FeatureFlag())

const bulkAdd = records => loadModel()
  .then(model => model.bulkCreate(records))

const findBy = ({ user, type, feature }, additionalOpts = {}) => loadModel()
  .then(model => model.findOne({ where: {
    mnemonic: models.buildMnemonic({user, feature, type}),
    ...additionalOpts,
  }}))

const load = id => loadModel()
  .then(model => model.findOne({ where: { id } }))

const list = (query, args) => loadModel()
  .then(model => model.findAll({ where: query, ...args }))

module.exports = {
  bulkAdd,
  findBy,
  list,
  load,
}

const { Feature } = require('../entities')

const loadModel = () => Promise.resolve(Feature())

const bulkAdd = records => loadModel()
  .then(model => model.bulkCreate(records))

const findOne = (mnemonic, additionalOpts = {}) => loadModel()
  .then(model => model.findOne({ where: { mnemonic, ...additionalOpts } }))

const load = id => loadModel()
  .then(model => model.findOne({ where: { id } }))

const list = (query, args) => loadModel()
  .then(model => model.findAll({ where: query, ...args }))

module.exports = {
  bulkAdd,
  findOne,
  list,
  load,
}

const R = require('ramda')
const { catalogue, rejectWithManaged } = require('../error')

const raiseError = (code, message) => () => rejectWithManaged(code, message)

const notFound = R.when(
  R.not,
  raiseError(catalogue.NOT_FOUND, 'Record not found')
)

const bulkAdd = loadModel => records => loadModel()
  .then(model => model.bulkCreate(records))

const add = loadModel => record => loadModel()
  .then(model => model.create(record))

const findOne = loadModel => (mnemonic, additionalOpts = {}) => loadModel()
  .then(model => model.findOne({ where: { mnemonic, ...additionalOpts } }))
  .then(notFound)

const load = loadModel => id => loadModel()
  .then(model => model.findOne({ where: { id } }))
  .then(notFound)

const list = loadModel => query => loadModel()
  .then(model => model.findAll(query))

const update = loadModel => (mnemonic, { enabled, author }) => loadModel()
  .then(model => model.findOne({ where: { mnemonic } }))
  .then(notFound)
  .then(loaded => {
    loaded.enabled = enabled
    loaded.updatedBy = author
    return loaded.save()
  })

module.exports = {
  bulkAdd,
  findOne,
  list,
  load,
  add,
  update,
}

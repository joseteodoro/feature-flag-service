const R = require('ramda')
const { catalogue, rejectWithManaged } = require('../error')

const { Feature } = require('../entities')

const loadModel = () => Promise.resolve(Feature())

const raiseError = (code, message) => () => rejectWithManaged(code, message)

const notFound = R.then(
  R.when(
    R.not,
    raiseError(catalogue.NOT_FOUND, 'Record not found')
  )
)

const bulkAdd = records => loadModel()
  .then(model => model.bulkCreate(records))

const add = record => loadModel()
  .then(model => model.create(record))

const findOne = (mnemonic, additionalOpts = {}) => loadModel()
  .then(model => model.findOne({ where: { mnemonic, ...additionalOpts } }))
  .then(notFound)

const load = id => loadModel()
  .then(model => model.findOne({ where: { id } }))
  .then(notFound)

const list = query => loadModel()
  .then(model => model.findAll(query))

const update = (mnemonic, { enabled }) => loadModel()
  .then(model => model.findOne({ where: { mnemonic } }))
  .then(notFound)
  .then(loaded => {
    loaded.enabled = enabled
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

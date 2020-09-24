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

const findOne = loadModel => ({ name }, additionalOpts = {}) => loadModel()
  .then(model => model.findOne({ where: { name, ...additionalOpts } }))
  .then(notFound)

const load = loadModel => id => loadModel()
  .then(model => model.findOne({ where: { id } }))
  .then(notFound)

const list = loadModel => where => loadModel()
  .then(model => model.findAll({ where }))

const updateReducer = source => (acc, key) => {
  acc[key] = source[key]
}

// TODO can I pass feature name here to all entities?
// even those one who doesnt have the feature name inside?
const update = loadModel => ({ name }, changes = {}) => loadModel()
  .then(model => model.findOne({ where: { name } }))
  .then(notFound)
  .then(loaded => {
    const changed = Object.keys(changes).reduce(updateReducer(changes), loaded)
    return changed.save()
  })

const disable = entity => {
  entity.enabled = false
  return entity.save()
}

const enable = entity => {
  entity.enabled = true
  return entity.save()
}

module.exports = {
  bulkAdd,
  findOne,
  list,
  load,
  add,
  update,
  disable,
  enable,
}

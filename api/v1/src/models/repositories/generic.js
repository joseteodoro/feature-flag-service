const R = require('ramda')
const uuid = require('uuid').v4

const { catalogue, rejectWithManaged } = require('../error')

const raiseError = (code, message) => () => rejectWithManaged(code, message)

const notFound = R.when(
  R.not,
  raiseError(catalogue.NOT_FOUND, 'Record not found')
)

const add = loader => async data => loader()
  .then(model => model.create({
    enabled: true,
    ...data,
    id: uuid(),
  }))

const list = loader => async query => loader()
  .then(model => model.findAll(query))

const traverseFields = (entity, data) => (_, key) => {
  entity[key] = data[key]
  return entity
}

const listFields = data => Object.keys(data) || []

const update = loader => async (where, data) => loader()
  .then(model => model.findOne({ where }))
  .then(notFound)
  .then(loaded => {
    listFields(data).reduce(traverseFields(loaded, data))
    return loaded.save()
  })

const findOne = loader => async where => loader()
  .then(model => model.findOne({ where }))

const enable = loader => async where => update(loader)(where, { enabled: true })

const disable = loader => async where => update(loader)(where, { enabled: false })

module.exports = {
  add,
  update,
  findOne,
  list,
  enable,
  disable,
}

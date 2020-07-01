const R = require('ramda')
const service = require('../services')
const { set } = require('../utils')

const handleNoContent = ctx => R.tap(
  R.when(
    R.not,
    R.compose(set('status', ctx), R.always(204))
  )
)

const findIdentifier = ctx =>
  service
    .findIdentifier(ctx.request.query)
    .then(handleNoContent(ctx))
    .then(set('body', ctx))

const listIdentifiers = ctx =>
  service
    .listIdentifiers(ctx.params.mpi)
    .then(R.objOf('result'))
    .then(set('body', ctx))

const addIdentifiers = ctx =>
  service
    .addIdentifiers(ctx.params.mpi, ctx.request.body.identifiers)
    .then(R.always(204))
    .then(set('status', ctx))

module.exports = {
  findIdentifier,
  listIdentifiers,
  addIdentifiers,
}

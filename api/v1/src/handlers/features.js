const R = require('ramda')
const service = require('../services')
const { set } = require('../utils')

const handleNoContent = ctx => R.tap(
  R.when(
    R.not,
    R.compose(set('status', ctx), R.always(204))
  )
)

const find = ctx =>
  service
    .findFeature(ctx.params.mnemonic, ctx.request.query)
    .then(handleNoContent(ctx))
    .then(set('body', ctx))

const list = ctx =>
  service
    .listFeatures(ctx.request.query)
    .then(R.objOf('result'))
    .then(set('body', ctx))

const add = ctx =>
  service
    .addFeature(ctx.request.body)
    .then(R.always(201))
    .then(set('body', ctx))

const update = ctx =>
  service
    .updateFeature(ctx.params.mnemonic, ctx.request.body)
    .then(R.always(201))
    .then(set('body', ctx))

module.exports = {
  find,
  list,
  add,
  update,
}

const R = require('ramda')
const { set } = require('../utils')

const handleNoContent = ctx => R.tap(
  R.when(
    R.not,
    R.compose(set('status', ctx), R.always(204))
  )
)

const findOne = service => ctx =>
  service.findOne(ctx.params, ctx.request.query)
    .then(handleNoContent(ctx))
    .then(set('body', ctx))

const list = service => ctx =>
  service.list(ctx.request.query)
    .then(R.objOf('result'))
    .then(set('body', ctx))

const add = service => ctx =>
  service.add(ctx.request.body)
    .then(R.always(201))
    .then(set('status', ctx))

const update = service => ctx =>
  service.update(ctx.params, ctx.request.body)
    .then(R.always(201))
    .then(set('status', ctx))

const disable = service => ctx =>
  service.disable(ctx.params, ctx.request.body)
    .then(R.always(201))
    .then(set('status', ctx))

const enable = service => ctx =>
  service.enable(ctx.params, ctx.request.body)
    .then(R.always(201))
    .then(set('status', ctx))

module.exports = {
  add,
  list,
  findOne,
  update,
  disable,
  enable,
}

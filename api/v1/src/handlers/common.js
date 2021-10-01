const R = require('ramda')
const { set } = require('../utils')
const { ManagedError, response, catalogue } = require('../models/error')

const output = ctx => ({ status, body }) => {
  ctx.status = status
  if (body) {
    ctx.body = body
  }
}

const handleNotFound = body => body
  ? Promise.resolve({ status: 200, body })
  : Promise.reject(new ManagedError('not found', '', response[catalogue.NOT_FOUND]))

const findOne = service => ctx => {
  return service.findOne(ctx.params, ctx.request.query)
    .then(handleNotFound)
    .then(output(ctx))
    .catch(output(ctx))
}

const list = service => ctx => service.list(ctx.request.query)
  .then(R.objOf('result'))
  .then(set('body', ctx))

const add = service => ctx => service.add(ctx.request.body)
  .then(R.always(201))
  .then(set('status', ctx))

const update = service => ctx =>
  service.findOne(ctx.params, ctx.request.query)
    .then(handleNotFound)
    .then(_ => service.update(ctx.params, ctx.request.body))
    .then(R.always(201))
    .then(set('status', ctx))
    .catch(output(ctx))

const applyUpdate = (service, ctx, fn) => service.findOne(ctx.params)
  .then(handleNotFound(ctx))
  .then(fn)
  .then(R.always(201))
  .then(set('status', ctx))

const disable = service => ctx => applyUpdate(
  service,
  ctx,
  _ => service.disable(ctx.params)
)

const enable = service => ctx => applyUpdate(
  service,
  ctx,
  _ => service.enable(ctx.params)
)

module.exports = {
  add,
  list,
  findOne,
  update,
  disable,
  enable,
}

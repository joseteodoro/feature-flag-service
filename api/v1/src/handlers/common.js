const R = require('ramda')
const { set } = require('../utils')
const { ManagedError, response, catalogue } = require('../models/error')

const output = ctx => ({ status, body }) => {
  ctx.status = status
  if (body) {
    ctx.body = body
  }
}

/* eslint-disable prefer-promise-reject-errors */
const handleNotFound = body => body
  ? Promise.resolve({ status: 200, body })
  : Promise.reject(new ManagedError('not found', '', response[catalogue.NOT_FOUND]))

const findOne = service => ctx => {
  console.log({ params: ctx.params })
  return service.findOne(ctx.params, ctx.request.query)
    .then(handleNotFound)
    .then(output(ctx))
    .catch(output(ctx))
}

const list = service => ctx =>
  service.list(ctx.request.query)
    .then(R.objOf('result'))
    .then(set('body', ctx))

const add = service => ctx =>
  service.add(ctx.request.body)
    .then(R.always(201))
    .then(set('status', ctx))

const update = service => ctx =>
  service.findOne(ctx.params, ctx.request.query)
    .then(handleNotFound)
    .then(_ => service.update(ctx.params, ctx.request.body))
    .then(R.always(201))
    .then(set('status', ctx))
    .catch(output(ctx))

const disable = service => ctx =>
  service.findOne(ctx.params)
    .then(handleNotFound)
    .then(_ => service.disable(ctx.params))
    .then(R.always(201))
    .then(set('status', ctx))
    .catch(output(ctx))

const enable = service => ctx =>
  service.findOne(ctx.params)
    .then(handleNotFound(ctx))
    .then(_ => service.enable(ctx.params))
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

const R = require('ramda')
const { set } = require('../utils')
const service = require('../services/handler')

const handleNoContent = ctx => R.tap(
  R.when(
    R.not,
    R.compose(set('status', ctx), R.always(204))
  )
)

const evaluate = ctx =>
  service.engine({...ctx.request.query, ...ctx.params, ...ctx.request.body})
    .then(handleNoContent(ctx))
    .then(set('body', ctx))

module.exports = { evaluate }

const R = require('ramda')
const { set } = require('../utils')
const service = require('../services/users')
const featured = require('../services/featured')
const common = require('./common')

const findOne = common.findOne(service)

const list = common.list(service)

const add = common.add(service)

const update = common.update(service)

const listEnabledFeatures = ctx => featured.listFeatures(ctx.params)
  .then(R.always(200))
  .then(set('status', ctx))

module.exports = {
  add,
  list,
  findOne,
  listEnabledFeatures,
  update,
}

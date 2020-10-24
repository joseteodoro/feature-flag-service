const R = require('ramda')
const { set } = require('../utils')
const service = require('../services/features')
const featured = require('../services/featured')
const common = require('./common')

const findOne = common.findOne(service)

const list = common.list(service)

const add = common.add(service)

const update = common.update(service)

const enable = common.enable(service)

const disable = common.disable(service)

const listEnabledUsers = ctx => featured.listUsers(ctx.params)
  .then(R.always(200))
  .then(set('status', ctx))

module.exports = {
  add,
  list,
  findOne,
  listEnabledUsers,
  update,
  enable,
  disable,
}

const service = require('../services')
const common = require('./common')

const findOne = common.findOne(service.beta)

const list = common.list(service.beta)

const add = common.add(service.beta)

const enable = common.enable(service.feature)

const disable = common.disable(service.feature)

module.exports = {
  add,
  list,
  findOne,
  enable,
  disable,
}

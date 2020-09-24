const service = require('../services')
const common = require('./common')

const findOne = common.findOne(service.tag)

const list = common.list(service.tag)

const add = common.add(service.tag)

const enable = common.enable(service.tag)

const disable = common.disable(service.tag)

module.exports = {
  add,
  list,
  findOne,
  enable,
  disable,
}

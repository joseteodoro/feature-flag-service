const service = require('../services')
const common = require('./common')

const findOne = common.findOne(service.feature)

const list = common.list(service.feature)

const add = common.add(service.feature)

const update = common.update(service.feature)

const enable = common.enable(service.feature)

const disable = common.disable(service.feature)

module.exports = {
  add,
  list,
  findOne,
  update,
  enable,
  disable,
}

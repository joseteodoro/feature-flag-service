const db = require('../models/repositories/generic')
const { Feature } = require('../models/entities')

const findOne = db.findOne(Feature)

const list = db.list(Feature)

const add = db.add(Feature)

const update = db.update(Feature)

const enable = db.enable(Feature)

const disable = db.disable(Feature)

module.exports = {
  findOne,
  list,
  add,
  update,
  enable,
  disable,
}

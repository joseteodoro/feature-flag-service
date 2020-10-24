const db = require('../models/repositories/generic')
const { Users } = require('../models/entities')

const findOne = db.findOne(Users)

const list = db.list(Users)

const add = db.add(Users)

const update = db.update(Users)

module.exports = {
  findOne,
  list,
  add,
  update,
}

const db = require('../models/repositories/generic')
const { Featured } = require('../models/entities')

const findOne = db.findOne(Featured)

const list = db.list(Featured)

const add = db.add(Featured)

const update = db.update(Featured)

const enable = db.enable(Featured)

const disable = db.disable(Featured)

const listUsers = ({ feature }) => db.list(Featured)({ feature, enabled: true })

const listFeatures = ({ user }) => db.list(Featured)({ user, enabled: true })

module.exports = {
  findOne,
  list,
  add,
  update,
  enable,
  disable,
  listUsers,
  listFeatures,
}

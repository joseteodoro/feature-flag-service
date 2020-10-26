const db = require('../models/repositories/generic')
const { Users } = require('../models/entities')

const findOne = db.findOne(Users)

const list = async ({beta: bs, ...query}) => {
  const beta = (bs || 'true').toLowerCase() === 'true'
  return db.list(Users)({...query, beta})
}

const add = db.add(Users)

const update = db.update(Users)

module.exports = {
  findOne,
  list,
  add,
  update,
}

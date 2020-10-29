const db = require('../models/repositories/generic')
const { Feature } = require('../models/entities')

const findOne = db.findOne(Feature)

const list = async ({enabled: bs, ...query}) => {
  const enabled = (bs || 'true').toLowerCase() === 'true'
  return db.list(Feature)({...query, enabled})
}

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

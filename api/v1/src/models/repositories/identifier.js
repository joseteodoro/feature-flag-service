const { Identifier } = require('../entities')
const { bindModel } = require('./helpers')

const bulkAdd = bindModel(Identifier, 'bulkCreate')

const findOne = ({ type, value }) => bindModel(Identifier, 'findOne', { where: { type, value } })

const list = (query, args) => bindModel(Identifier, 'findAll', { where: query, ...args })

module.exports = {
  bulkAdd,
  findOne,
  list,
}

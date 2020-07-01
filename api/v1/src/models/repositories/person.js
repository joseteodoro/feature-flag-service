const { Person } = require('../entities')
const { bindModel } = require('./helpers')

const add = () => bindModel(Person, 'create', {})

const get = bindModel(Person, 'findByPk')

const list = (query, args) => bindModel(Person, 'findAll', { where: query, attributes: ['mpi'], ...args })

module.exports = {
  add,
  get,
  list,
}

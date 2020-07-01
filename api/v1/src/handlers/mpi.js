const { set } = require('../utils')
const service = require('../services')

const findAll = ctx => service
  .findAllMpis(ctx.request.query)
  .then(set('body', ctx))

module.exports = {
  findAll,
}

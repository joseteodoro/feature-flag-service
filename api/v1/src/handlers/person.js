const R = require('ramda')
const service = require('../services')
const { set } = require('../utils')

const mpiResponse = R.pipe(
  R.path(['person', 'mpi']),
  R.objOf('mpi')
)

const createWithIdentifiers = ctx =>
  service
    .createPersonWithIdentifiers(ctx.request.body.identifiers)
    .then(mpiResponse)
    .then(set('body', ctx))

module.exports = {
  createWithIdentifiers,
}

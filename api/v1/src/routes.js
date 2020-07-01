const Router = require('koa-router')

// middlewares
const validator = require('koa-async-validator')
const customValidators = require('./utils/validators')
const validate = require('./middlewares/validate')
const error = require('./middlewares/error')

// schemas
const schemas = require('./models/request-schemas')

// handlers
const person = require('./handlers/person')
const identifier = require('./handlers/identifier')
const mpi = require('./handlers/mpi')

const router = new Router()

router.use(error)
router.use(validator({ customValidators }))

router.post('/identifiers', validate(schemas.personCreateWithIdentifiers), person.createWithIdentifiers)
router.get('/identifiers', validate(schemas.identifierQuery), identifier.findIdentifier)
router.get('/identifiers/:mpi', validate(schemas.identifierList), identifier.listIdentifiers)
router.put('/identifiers/:mpi', validate(schemas.identifierAddToPerson), identifier.addIdentifiers)
router.get('/mpis', validate(schemas.listAllMpis), mpi.findAll)

module.exports = router

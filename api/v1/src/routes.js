const Router = require('koa-router')

// middlewares
const validator = require('koa-async-validator')
const customValidators = require('./utils/validators')
// const validate = require('./middlewares/validate')
const error = require('./middlewares/error')

// schemas
// const schemas = require('./models/request-schemas')

// handlers
const evaluation = require('./handlers/evaluation')
const users = require('./handlers/users')
const features = require('./handlers/features')
const flagged = require('./handlers/featured')

const router = new Router()

router.use(error)
router.use(validator({ customValidators }))

// router.post('/identifiers', validate(schemas.personCreateWithIdentifiers), person.createWithIdentifiers)
// router.get('/identifiers', validate(schemas.identifierQuery), identifier.findIdentifier)
// router.get('/identifiers/:mpi', validate(schemas.identifierList), identifier.listIdentifiers)
// router.put('/identifiers/:mpi', validate(schemas.identifierAddToPerson), identifier.addIdentifiers)
// router.get('/mpis', validate(schemas.listAllMpis), mpi.findAll)

router.get('/evaluate', evaluation.evaluate)
router.get('/evaluate/:feature', evaluation.evaluate)
router.get('/evaluate/:feature/:user', evaluation.evaluate)

router.post('/features', features.add)
router.get('/features', features.list)
router.get('/features/:feature', features.findOne)
router.get('/features/:feature/users', features.listEnabledUsers)
router.put('/features/:feature', features.update)
router.put('/features/:feature/enable', features.enable)
router.put('/features/:feature/disable', features.disable)

router.post('/flagged/:feature/:user', flagged.add)
router.get('/flagged/:feature/users', flagged.listUsers)
router.get('/flagged/:user/features', flagged.listFeatures)
router.get('/flagged/:feature/:user', flagged.findOne)
router.put('/flagged/:feature/:user', flagged.update)
router.put('/features/:feature/:user/enable', flagged.enable)
router.put('/features/:feature/:user/disable', flagged.disable)

router.post('/users', users.add)
router.get('/users', users.list)
router.get('/users/:name', users.findOne)
router.get('/users/:user/features', users.listEnabledFeatures)
router.put('/users/:name', users.update)

module.exports = router

const Router = require('koa-router')

// middlewares
const validator = require('koa-async-validator')
const customValidators = require('./utils/validators')
const validate = require('./middlewares/validate')
const error = require('./middlewares/error')

// schemas
const schemas = require('./models/request-schemas')

// handlers
const features = require('./handlers/features')
const tags = require('./handlers/tag')
const beta = require('./handlers/beta')

const router = new Router()

router.use(error)
router.use(validator({ customValidators }))

// router.post('/identifiers', validate(schemas.personCreateWithIdentifiers), person.createWithIdentifiers)
// router.get('/identifiers', validate(schemas.identifierQuery), identifier.findIdentifier)
// router.get('/identifiers/:mpi', validate(schemas.identifierList), identifier.listIdentifiers)
// router.put('/identifiers/:mpi', validate(schemas.identifierAddToPerson), identifier.addIdentifiers)
// router.get('/mpis', validate(schemas.listAllMpis), mpi.findAll)

router.post('/features', features.add)
router.get('/features', features.list)
router.get('/features/:name', features.findOne)
router.put('/features/:name', features.update)
router.get('/features/:name/enable', features.enable)
router.get('/features/:name/disable', features.disable)

router.post('/tags', tags.add)
router.get('/tags', tags.list)
router.get('/tags/:feature/:name', tags.findOne)
router.post('/tags/:feature/:name/enable', tags.enable)
router.post('/tags/:feature/:name/disable', tags.disable)
router.post('/features/:feature/:name/enable', tags.enable)
router.post('/features/:feature/:name/disable', tags.disable)

router.post('/beta', beta.add)
router.get('/beta', beta.list)
router.get('/beta/:name', tags.findOne)
router.post('/beta/:name/enable', beta.enable)
router.post('/beta/:name/disable', beta.disable)

module.exports = router

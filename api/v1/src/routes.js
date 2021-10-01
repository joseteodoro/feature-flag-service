const Router = require('koa-router')

// middlewares
const validator = require('koa-async-validator')
const customValidators = require('./utils/validators')
const error = require('./middlewares/error')

// handlers
const features = require('./handlers/features')

const router = new Router()

router.use(error)
router.use(validator({ customValidators }))

router.post('/features', features.add)
router.get('/features', features.list)
router.get('/features/:mnemonic', features.find)
router.put('/features/:mnemonic', features.update)

module.exports = router

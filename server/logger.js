const { loggerConfig } = require('../config')
const koaPinoLogger = require('koa-pino-logger')

module.exports = () => koaPinoLogger(loggerConfig)

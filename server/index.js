const { createServer } = require('./server')
const config = require('../config')
const logger = require('../config/logger')

const init = async () => {
  const app = await createServer()
  logger.info(`Starting server on port ${config.api.port}`)
  app.listen(config.api.port)
}

init()

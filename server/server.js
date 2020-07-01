const Koa = require('koa')
const body = require('koa-bodyparser')
const Router = require('koa-router')
const { healthcheck } = require('./utils')
const logger = require('./logger')
const api = require('../api')

const createServer = async () => {
  const app = new Koa()
  app.use(logger())
  const router = new Router()

  app.use(body({
    jsonLimit: '20mb',
    formLimit: '20mb',
    textLimit: '20mb',
  }))
  router.get('/health', healthcheck)
  Object.entries(api()).forEach(([version, versionRouter]) =>
    router.use(`/api/${version}`, versionRouter.routes())
  )

  app.use(router.routes())

  return app
}

module.exports = {
  createServer,
}

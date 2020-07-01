const db = require('../db')

const allowOrigins = (origins = []) => (ctx) => {
  const requestOrigin = ctx.request.header.origin
  return (origins.some(regex => regex.test(requestOrigin)))
    ? requestOrigin
    : ctx.throw(`${requestOrigin} is not a valid origin`)
}

const healthcheck = ctx =>
  db
    .connect()
    .then(() => {
      ctx.body = { db: true, server: true, timestamp: new Date() }
    })

module.exports = {
  allowOrigins,
  healthcheck,
}

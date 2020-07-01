const logger = require('../../../../config/logger')
const { catalogue, ManagedError } = require('../models/error')

/**
 * Creates request validation middleware that validates the request against the provided schema.
 *
 * @module middlewares/validate
 * @name validate
 * @version v1
 * @async
 * @param {Object} schema request definition schema
 * @returns {function(Object, Function): Promise} validation middlewares: uses koa-async-validator applying the schema to the context:
 * - verifies if the are validation errors in the context
 * - throws INVALID_REQUEST error if there are
 */
module.exports = schema => (ctx, next) => {
  ctx.check(schema)
  return ctx.validationErrors()
    .then(error => {
      if (error) {
        logger.error('Request validation error', error)
        return Promise.reject(new ManagedError(catalogue.INVALID_REQUEST))
      }
      return next()
    })
}

const destroy = schema => schema.destroy({ where: {} })
const destroySequence = (promise, schema) => promise.then(_ => destroy(schema))

afterEach(async () => {
  const models = require('../../../src/models/entities')
  const schemas = await Promise.all(Object.keys(models).sort().map(k => models[k]).map(m => m()))
  await schemas.reduce(destroySequence, Promise.resolve())
})

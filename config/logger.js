const pino = require('pino')
const { api: { env, name } } = require('./index')

const isDevEnvironment = env => ['local', 'dev', 'development', 'test', 'debug', 'homolog'].includes(env)

const prepareLogger = env => {
  const [level, prettyPrint] = isDevEnvironment(env) ? ['debug', true] : ['debug', false]
  return pino({ name, level, prettyPrint })
}

module.exports = prepareLogger(env)

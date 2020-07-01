const { is } = require('ramda')

const noop = () => undefined

const pNoop = () => Promise.resolve()

const isFunction = is(Function)

/**
 * @typedef {Object} LazyDisposableProvider
 * @property {Function} get `get :: () -> Promise Instance Error` to get the lazy instance
 * @property {Function} forceDispose `forceDispose :: () -> Promise ()` forces the provider to dispose of the instance (useful to be called in signal handlers)
 */

/**
 * Creates a singleton instance from a promisified factory function.
 * The singleton can be disposed after an expiration timeout.
 * This is useful for instances that depend on resources that have an expiration date/interval (e.g. secrets, cache keys)
 * Subsequent calls to `get` after the expirtaion will cause a reinstantiation via the factory function.
 * (the instance will be "cached" untill the next expirtaion timeout cycle ticks).
 *
 * @param {{expiration: Number, dispose: Function, log: Function}} config configuration
 * @param {Number} config.expiration expiration in milliseconds
 * @param {Function} config.log logging function in the form `log :: (*) -> ()`
 * @param {Function} config.dispose function to dispose the instance (release resources e.g. files, connections) after the expirtaion time in the form `dispose :: Instance -> Promise () Error`
 * @param {Function} factory promisified instance factory function in the form `factory :: () -> Promise Instance Error`
 * @returns {LazyDisposableProvider} lazy singleton instance provider
 */
const lazyDisposableSingleton = ({ expiration, dispose = pNoop, log = noop }, factory) => {
  let instance
  let instancePromise
  let previousDisposableInstance
  let expirationTimeoutCancellation

  const doDispose = () => {
    log('Dereferencing instance. Disposing in next instantiation cycle')
    previousDisposableInstance = instance
    instance = null
  }

  const clear = () => {
    instancePromise = null
    clearTimeout(expirationTimeoutCancellation)
    expirationTimeoutCancellation = expiration && expiration > 0
      ? setTimeout(doDispose, expiration)
      : null
  }

  const disposePrevious = () =>
    previousDisposableInstance && isFunction(dispose)
      ? (
        log('Disposing instance'),
        dispose(previousDisposableInstance)
          .catch(error => log(error, 'Failed to dispose instance'))
          .finally(() => (previousDisposableInstance = null))
      )
      : Promise.resolve((previousDisposableInstance = null))

  const construct = () => {
    log('Building instance')
    instancePromise = disposePrevious()
      .then(() => factory())
      .then(instantiated => (instance = instantiated))
      .finally(clear)
    return instancePromise
  }

  const get = () => Promise.resolve(instance || instancePromise || construct())

  const forceDispose = () => {
    doDispose()
    disposePrevious()
  }

  return {
    get,
    forceDispose,
  }
}

module.exports = {
  lazyDisposableSingleton,
}

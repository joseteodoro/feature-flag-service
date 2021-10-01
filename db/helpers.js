const { is } = require('ramda')

const noop = () => undefined

const pNoop = () => Promise.resolve()

const isFunction = is(Function)

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

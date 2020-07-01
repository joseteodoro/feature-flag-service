const R = require('ramda')

const resolve = value => Promise.resolve(value)

const reject = error => Promise.reject(error)

const awaitAll = promises => Promise.all(promises)

const set = R.curry((key, obj, value) => {
  obj[key] = value
  return obj
})

module.exports = {
  resolve,
  reject,
  awaitAll,
  set,
}

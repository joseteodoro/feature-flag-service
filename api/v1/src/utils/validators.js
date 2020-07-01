// isArrayOf :: Array T -> (T -> boolean) -> boolean
const isArrayOf = (value, validateElement) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(validateElement)

// assert :: T -> (T -> boolean) -> boolean
const assert = (value, predicate) => predicate(value)

module.exports = {
  isArrayOf,
  assert,
}

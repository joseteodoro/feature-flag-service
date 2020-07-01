const R = require('ramda')

// invokeModelMethod :: String -> Any -> Model -> Promise(Error, Any)
const invokeModelMethod = R.curry(
  (method, args, model) => model[method](args)
)

// bindModel :: Schema -> String -> Any -> (Model -> Promise(Error, Any))
const bindModel = R.curry(
  (schema, method, args) => schema()
    .then(invokeModelMethod(method, args))
)

module.exports = {
  bindModel,
}

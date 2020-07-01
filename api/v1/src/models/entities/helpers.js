const model = (connection, name, schema, options) => () =>
  connection()
    .then(conn => conn.define(name, schema, options))

module.exports = {
  model,
}

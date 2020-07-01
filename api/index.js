const { readdirSync, statSync } = require('fs')
const { join } = require('path')

const dirs = dirPath => readdirSync(dirPath).filter(filePath => statSync(join(dirPath, filePath)).isDirectory())

/**
 * Map version => version router
 *
 * @module api
 * @name index
 * @returns {Map<string,{routes: function():Array<Function>}>} version routers indexed by the version name
 */
const routes = () => dirs(__dirname)
  .map(name => [name, require(join(__dirname, name, 'src', 'routes'))])
  .reduce((acc, [version, router]) => ({ ...acc, [version]: router }), {})

module.exports = routes

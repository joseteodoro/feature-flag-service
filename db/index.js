const R = require('ramda')
const Sequelize = require('sequelize')
const cls = require('continuation-local-storage')

const { database: config } = require('../config')
const mainLogger = require('../config/logger')

const { lazyDisposableSingleton } = require('./helpers')

const namespace = cls.createNamespace(config.namespace)
Sequelize.useCLS(namespace)

const logger = mainLogger.child({ module: 'sequelize', level: 'debug' })
// Needed because sequelize passes a mole of extra data we don't want to log to the logger function
const queryLogger = R.unary(logger.debug.bind(logger, '[Database]'))

const getConnection = () => Promise.resolve(
  new Sequelize(
    config.database, config.username, config.password,
    R.assoc('logging', queryLogger, config)
  )
)

const pool = lazyDisposableSingleton({
  expiration: config.secretExpiration,
  dispose: R.invoker(0, 'close'),
  log: R.unary(mainLogger.debug.bind(mainLogger)),
}, getConnection)

const connection = () => pool.get()

/**
 * @module models/repository
 */
module.exports = {
  /**
   * Configured Sequelize instance with access to the database (i.e. the atual repository instance)
   * @returns Promise sequelize
   */
  connection,
  /**
   * Sequelize static import
   * @name Sequelize
   */
  Sequelize,
  /**
   * Model schema attributes types
   * @name DataTypes
   */
  DataTypes: Sequelize,
  /**
   * Connects to database
   * @returns Promise
   */
  connect: () => connection().then(conn => conn.authenticate()),
  /**
   * Connects to database
   * @returns Promise
   */
  ping: () => connection().then(conn => conn.authenticate()),
  /**
   * transaction :: (Transaction -> Promise a e) -> Promise a e
   */
  transaction: callback => connection().then(conn => conn.transaction(callback)),
  /**
   * transactionWithLevel :: Transaction.ISOLATION_LEVELS -> (Transaction -> Promise a e) -> Promise a e
   */
  transactionWithLevel: (level, callback) => connection().then(conn => conn.transaction(level, callback)),

  Transaction: {
    ISOLATION_LEVELS: Sequelize.Transaction.ISOLATION_LEVELS,
  },
  ERROR: {
    'CONSTRAINT_VIOLATION': {
      name: 'SequelizeUniqueConstraintError',
      code: '23505',
    },
  },
}

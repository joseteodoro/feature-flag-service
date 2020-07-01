const { env } = process
const pck = require('../package.json')

const environment = env.NODE_ENV || 'dev'

const TEST_DB = 'sqlite'

const ENVVARS_REQUIRED_ERROR_MESSAGE = 'EXITING PROCESSES: MISSING REQUIRED ENVIRONMENT VARIABLES. Check if all of the following are set:'

const ENVVARS_REQUIRED = [
  'NODE_ENV',
  'DB_DIALECT',
  'DB_HOST',
  'DB_DATABASE',
  'DB_USER',
  'DB_PORT',
]

const checkRequiredVars = (required = [], current = {}) => {
  if (env.NODE_ENV === 'production') {
    console.error(ENVVARS_REQUIRED_ERROR_MESSAGE, required)
    process.exit(1)
  }
}

checkRequiredVars(ENVVARS_REQUIRED)

module.exports = {
  api: {
    name: pck.name,
    env: environment,
    port: env.API_PORT || 3000,
  },
  timezone: env.TIMEZONE || 'America/New_York',
  database: {
    dialect: env.DB_DIALECT || 'sqlite',
    host: env.DB_HOST || 'local.sqlite',
    database: env.DB_DATABASE || 'featureflag',
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    port: parseInt(env.DB_PORT || 5432),
    pool: {
      min: 0,
      max: parseInt(env.DB_POOL_SIZE || 20),
      acquire: parseInt(env.DB_CONN_ACQUIRE || 2000),
      idle: parseInt(env.DB_CONN_IDLE || 300),
      evict: parseInt(env.DB_CONN_EVICT || 300),
    },
    schemas: {
      options: {
        timestamps: true,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
      },
    },
    namespace: 'feature-flag-api',
  },
}

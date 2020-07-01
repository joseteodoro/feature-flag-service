const defaultSchemaOptions = require('../../../../../config').database.schemas.options
const { connection, Sequelize } = require('../../../../../db')

const helpers = require('./helpers')

const DEFAULT_ADMIN = 'admin@citlab.com'

const schema = {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  mnemonic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: DEFAULT_ADMIN,
    field: 'created_by',
  },
  updatedBy: {
    type: Sequelize.STRING,
    allowNull: DEFAULT_ADMIN,
    field: 'updated_by',
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at',
  },
}

const options = {
  ...defaultSchemaOptions,
  tableName: 'feature',
  comment: `features`,
}

module.exports = helpers.model(connection, 'Feature', schema, options)

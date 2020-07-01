const defaultSchemaOptions = require('../../../../../config').database.schemas.options
const { connection, Sequelize } = require('../../../../../db')

const { model } = require('./helpers')

const DEFAULT_ADMIN = 'admin@citlab.com'

const schema = {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false,
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
  // foreign-keys
  feature: {
    type: Sequelize.BIGINT,
    field: 'feature_id',
    references: { model: 'feature', key: 'id' },
  },
}

const options = {
  ...defaultSchemaOptions,
  tableName: 'featureflag',
  comment: `feature flags`,
}

module.exports = model(connection, 'FeatureFlag', schema, options)

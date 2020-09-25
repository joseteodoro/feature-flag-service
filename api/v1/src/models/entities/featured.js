const defaultSchemaOptions = require('../../../../../config').database.schemas.options
const { connection, Sequelize } = require('../../../../../db')

const helpers = require('./helpers')

const schema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  user: {
    allowNull: false,
    type: Sequelize.UUID,
  },
  feature: {
    allowNull: false,
    type: Sequelize.UUID,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  tableName: 'featured',
  comment: `featured`,
}

module.exports = helpers.model(connection, 'Featured', schema, options)

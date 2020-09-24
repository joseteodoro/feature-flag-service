const defaultSchemaOptions = require('../../../../../config').database.schemas.options
const { connection, Sequelize } = require('../../../../../db')

const TYPES = require('../feature-types')
const helpers = require('./helpers')

const schema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  feature: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  type: {
    type: Sequelize.ENUM,
    values: Object.values(TYPES),
    allowNull: false,
    defaultValue: TYPES.NO_ONE,
  },
  range: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
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

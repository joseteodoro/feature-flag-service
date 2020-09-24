const defaultSchemaOptions = require('../../../../../config').database.schemas.options
const { connection, Sequelize } = require('../../../../../db')

const helpers = require('./helpers')

const schema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  beta: {
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
  tableName: 'user',
  comment: `users`,
}

module.exports = helpers.model(connection, 'Users', schema, options)

const TYPES = require('../../api/v1/src/models/feature-types')

const schema = Sequelize => ({
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  allow: {
    type: Sequelize.ENUM,
    values: Object.values(TYPES),
    allowNull: false,
  },
  span: {
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
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('feature', schema(Sequelize))
      .then(_ => queryInterface.addIndex('feature', ['name'], {
        indexType: 'hash',
        name: 'feature_name_idx',
        indicesType: 'UNIQUE',
      }))
      .then(_ => queryInterface.addIndex('feature', ['name'], {
        name: 'feature_name_sort_idx',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('feature', 'feature_name_idx')
      .then(_ => queryInterface.removeIndex('feature', 'feature_name_sort_idx'))
      .then(_ => queryInterface.dropTable('feature')),
}

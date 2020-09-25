const TYPES = require('../../api/v1/src/models/feature-types')

const schema = Sequelize => ({
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
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('feature', schema(Sequelize))
      .then(_ => queryInterface.addIndex('feature', ['feature'], {
        indexType: 'hash',
        name: 'feature_feature_idx',
        indicesType: 'UNIQUE',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('feature', 'feature_feature_idx')
      .then(_ => queryInterface.dropTable('feature')),
}

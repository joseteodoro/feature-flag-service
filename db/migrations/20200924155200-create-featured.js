const schema = Sequelize => ({
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
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('featured', schema(Sequelize))
      .then(_ => queryInterface.addIndex('featured', ['feature'], {
        name: 'featured_feature_idx',
      }))
      .then(_ => queryInterface.addIndex('featured', ['user'], {
        name: 'featured_user_idx',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('featured', 'featured_feature_idx')
      .then(_ => queryInterface.removeIndex('featured', 'featured_user_idx'))
      .then(_ => queryInterface.dropTable('featured')),
}

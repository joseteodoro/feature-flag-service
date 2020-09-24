const schema = Sequelize => ({
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  feature: {
    type: Sequelize.STRING,
    allowNull: false,
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
    return queryInterface.createTable('feature_tag', schema(Sequelize))
      .then(_ => queryInterface.addIndex('feature_tag', ['name'], {
        indexType: 'hash',
        name: 'feature_tag_name_idx',
        indicesType: 'UNIQUE',
      }))
      .then(_ => queryInterface.addIndex('feature_tag', ['name'], {
        name: 'feature_tag_name_sort_idx',
      }))
      .then(_ => queryInterface.addIndex('feature_tag', ['feature'], {
        name: 'feature_tag_feature_sort_idx',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('feature_tag', 'feature_tag_name_idx')
      .then(_ => queryInterface.removeIndex('feature_tag', 'feature_tag_name_sort_idx'))
      .then(_ => queryInterface.removeIndex('feature_tag', 'feature_tag_feature_sort_idx'))
      .then(_ => queryInterface.dropTable('feature_tag')),
}

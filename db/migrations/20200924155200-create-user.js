const schema = Sequelize => ({
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
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', schema(Sequelize))
      .then(_ => queryInterface.addIndex('user', ['name'], {
        indexType: 'hash',
        name: 'user_name_idx',
        indicesType: 'UNIQUE',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('user', 'user_name_idx')
      .then(_ => queryInterface.dropTable('user')),
}

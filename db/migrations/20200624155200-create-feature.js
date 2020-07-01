const DEFAULT_ADMIN = 'admin@citlab.com'

const schema = Sequelize => ({
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
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('feature', schema(Sequelize))
      .then(_ => queryInterface.addIndex('feature', ['mnemonic'], {
        indexType: 'hash',
        name: 'feature_mnemonic_idx',
        indicesType: 'UNIQUE',
      }))
      .then(_ => queryInterface.addIndex('feature', ['mnemonic'], {
        name: 'feature_mnemonic_sort_idx',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('feature', 'feature_mnemonic_idx')
      .then(_ => queryInterface.removeIndex('featureflag', 'feature_mnemonic_sort_idx'))
      .then(_ => queryInterface.dropTable('feature')),
}

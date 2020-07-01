const DEFAULT_ADMIN = 'admin@citlab.com'

const schema = Sequelize => ({
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
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('featureflag', schema(Sequelize))
      .then(_ => queryInterface.addIndex('featureflag', ['mnemonic'], {
        indexType: 'hash',
        name: 'feature_flag_mnemonic_idx',
        indicesType: 'UNIQUE',
      }))
      .then(_ => queryInterface.addIndex('featureflag', ['mnemonic'], {
        name: 'feature_flag_mnemonic_sort_idx',
      }))
      .then(_ => queryInterface.addIndex('featureflag', ['user'], {
        name: 'feature_flag_user_sort_idx',
      }))
      .then(() => queryInterface.addIndex('featureflag', ['feature_id'], {
        name: 'featureflag_feature_id_fk',
      }))
  },
  down: (queryInterface, _Sequelize) =>
    queryInterface.removeIndex('featureflag', 'feature_flag_mnemonic_idx')
      .then(_ => queryInterface.removeIndex('featureflag', 'feature_flag_mnemonic_sort_idx'))
      .then(_ => queryInterface.removeIndex('featureflag', 'feature_flag_user_sort_idx'))
      .then(_ => queryInterface.removeIndex('featureflag', 'featureflag_feature_id_fk'))
      .then(_ => queryInterface.dropTable('featureflag')),
}

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('companies', 'companyGroupId', {
        type: Sequelize.UUID,
        references: {
          model: 'companyGroups',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'restrict',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('companies', 'companyGroupId')
  }
};

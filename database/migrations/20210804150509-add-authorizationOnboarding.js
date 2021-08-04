'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('drivers', 'authorizationOnboarding', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('drivers', 'authorizationOnboarding')
  }
};

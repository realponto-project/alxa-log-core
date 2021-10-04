'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addConstraint('operations', { fields:  ['name', 'companyId'], type: 'unique', name: 'custom_unique_constraint_name' })
    
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeConstraint('operations', 'custom_unique_constraint_name');
    
  }
};

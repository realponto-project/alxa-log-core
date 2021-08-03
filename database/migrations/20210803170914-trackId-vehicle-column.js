'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'serialNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'serialNumber')
  }
}
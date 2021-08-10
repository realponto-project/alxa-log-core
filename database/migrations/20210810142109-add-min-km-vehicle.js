'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'minKm', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 44444
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'minKm')
  }
}
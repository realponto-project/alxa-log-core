'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('drivers', 'protocolInsuranceCompany', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('drivers', 'protocolInsuranceCompany',{
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3333
    })
  }
}
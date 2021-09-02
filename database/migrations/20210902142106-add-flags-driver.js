'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('drivers', 'expireDriverLicense', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()  
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'rg', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '12.345678-9'
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'cpf', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '123.456789-10'
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'expireASO', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'protocolInsuranceCompany', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 3333
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'expireProtocolInsuranceCompany', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: new Date()
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'mop', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }, { transaction: t }),
        queryInterface.addColumn('drivers', 'bond', {
          type: Sequelize.ENUM([
            'AGREGADO',
            'FROTA',
            'TERCEIRO',
            'TERCEIRO FIDELIZADO'
          ]),
          allowNull: false,
          defaultValue: 'FROTA'
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('drivers', 'expireDriverLicense', { transaction: t }),
        queryInterface.removeColumn('drivers', 'Rg', { transaction: t }),
        queryInterface.removeColumn('drivers', 'Cpf', { transaction: t }),
        queryInterface.removeColumn('drivers', 'expireASO', { transaction: t }),
        queryInterface.removeColumn('drivers', 'protocolInsuranceCompany', { transaction: t }),
        queryInterface.removeColumn('drivers', 'expireProtocolInsuranceCompany', { transaction: t }),
        queryInterface.removeColumn('drivers', 'MOP', { transaction: t }),
        queryInterface.removeColumn('drivers', 'bond', { transaction: t }),
      ]);
    });
  }
};
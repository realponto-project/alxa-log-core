'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('maintenanceOrderEvents', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: Sequelize.ENUM([
        'cancel',
        'service_external',
        'awaiting_budget',
        'solicitation',
        'check-in',
        'avaiable',
        'parking',
        'courtyard',
        'awaiting_repair',
        'dock',
        'wash',
        'supply',
        'check-out',
      ]),
      allowNull: false,
      defaultValue: 'solicitation',
    },
    maintenanceOrderId: {
      type: Sequelize.UUID,
      references: {
        model: 'maintenanceOrders',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    companyId: {
      type: Sequelize.UUID,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('maintenanceOrderEvents')
};
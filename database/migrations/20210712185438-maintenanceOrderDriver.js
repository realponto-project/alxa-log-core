'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('maintenanceOrderDrivers', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    driverId: {
      type: Sequelize.UUID,
      references: {
        model: 'drivers',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
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
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('maintenanceOrderDrivers')
};
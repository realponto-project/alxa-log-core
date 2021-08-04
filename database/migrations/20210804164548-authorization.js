'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('authorizations', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    operationId: {
      type: Sequelize.UUID,
      references: {
        model: 'operations',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    vehicleId: {
      type: Sequelize.UUID,
      references: {
        model: 'vehicles',
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
  down: (queryInterface) => queryInterface.dropTable('authorizations')
};
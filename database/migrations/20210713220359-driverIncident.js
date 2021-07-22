'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('driverIncidents', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    incidentDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    incidentDescription: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    incidentType: {
      type: Sequelize.ENUM([
        'accident',
        'collision',
        'vehicle_break_down',
      ]),
      allowNull: false,
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
    companyId: {
      type: Sequelize.UUID,
      references: {
        model: 'companies',
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
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
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
  down: (queryInterface) => queryInterface.dropTable('driverIncidents')
};
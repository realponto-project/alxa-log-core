'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('maintenanceOrders', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    plateHorse: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    plateCart: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    maintenanceDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    costCenter: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    priority: {
      type: Sequelize.ENUM(['low', 'medium', 'high']),
      allowNull: false,
      defaultValue: 'low',
    },
    service: {
      type: Sequelize.ENUM(['preventive', 'corrective']),
      allowNull: false,
      defaultValue: 'preventive',
    },
    serviceDescription: {
      type: Sequelize.STRING,
      allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('maintenanceOrders')
};
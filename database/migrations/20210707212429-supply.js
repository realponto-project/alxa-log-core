'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('supplies', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    fuel: {
      type: Sequelize.ENUM([
        'diesel',
        'arlar',
      ]),
      allowNull: false,
      defaultValue: 'diesel',
    },
    km: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    totalLiters: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    odometer: {
      type: Sequelize.STRING,
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
  down: (queryInterface) => queryInterface.dropTable('supplies')
};
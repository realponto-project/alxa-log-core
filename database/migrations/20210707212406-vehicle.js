'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('vehicles', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    plate: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    fleet: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    preventiveMaintenanceLimite: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 6
    },
    lastMaintenance: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    situation: {
      type: Sequelize.ENUM(['regular', 'unregular']),
      allowNull: false,
      defaultValue: 'regular',
    },
    vehicleTypeId: {
      type: Sequelize.UUID,
      references: {
        model: 'vehicleTypes',
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
  down: (queryInterface) => queryInterface.dropTable('vehicles')
};
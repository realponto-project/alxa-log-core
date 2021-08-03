'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tracks', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    serverTimestamp:{
      type: Sequelize.DATE,
      allowNull: false,
    },
    eventTimestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    gpsTimeStamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    gpsLatitude: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    gpsLongitude: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    gpsDirection: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    gpsSpeed: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    odometer: {
      type: Sequelize.FLOAT,
      allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('tracks')
};
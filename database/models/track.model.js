const Sequelize = require('sequelize')

const Track = (sequelize) => {
  const Track = sequelize.define('track', {
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
  })
  
  Track.associate = (models) => {
    models.track.belongsTo(models.vehicle, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Track
}

module.exports = Track

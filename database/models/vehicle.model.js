const Sequelize = require('sequelize')

const Vehicle = (sequelize) => {
  const Vehicle = sequelize.define('vehicle', {
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
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    serialNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
    },
    minKm: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 444444,
    },
  })
  
  Vehicle.associate = (models) => {
    models.vehicle.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.vehicle.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.vehicle.belongsTo(models.vehicleType, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.vehicle.hasMany(models.track, {
      foreignKey: {
        allowNull: false,
      }
    })

  }

  return Vehicle
}

module.exports = Vehicle

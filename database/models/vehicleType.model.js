const Sequelize = require('sequelize')

const VehicleType = (sequelize) => {
  const VehicleType = sequelize.define('vehicleType', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  })
  
  VehicleType.associate = (models) => {
    models.vehicleType.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.vehicleType.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.vehicleType.hasMany(models.vehicle, {
      foreignKey: {
        allowNull: false,
      }
    })

  }

  return VehicleType
}

module.exports = VehicleType

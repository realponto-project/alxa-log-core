const Sequelize = require('sequelize')

const Driver = (sequelize) => {
  const Driver = sequelize.define('driver', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    driverLicense: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })
  
  Driver.associate = (models) => {
    models.driver.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.driver.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.driver.hasMany(models.driverIncident, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Driver
}

module.exports = Driver

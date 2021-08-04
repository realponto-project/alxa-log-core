const Sequelize = require('sequelize')

const Driver = (sequelize) => {
  const Driver = sequelize.define('authorization', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  })
  
  Driver.associate = (models) => {
    models.authorization.belongsTo(models.driver, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.authorization.belongsTo(models.operation, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.authorization.belongsTo(models.vehicle, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Driver
}

module.exports = Driver

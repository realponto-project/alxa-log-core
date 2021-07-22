const Sequelize = require('sequelize')

const MaintenanceOrderDriver = (sequelize) => {
  const MaintenanceOrderDriver = sequelize.define('maintenanceOrderDriver', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  })

  MaintenanceOrderDriver.associate = (models) => {
    models.maintenanceOrderDriver.belongsTo(models.maintenanceOrder, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrderDriver.belongsTo(models.driver, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return MaintenanceOrderDriver
}

module.exports = MaintenanceOrderDriver

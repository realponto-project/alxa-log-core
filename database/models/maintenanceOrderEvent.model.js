const Sequelize = require('sequelize')

const MaintenanceOrderEvent = (sequelize) => {
  const MaintenanceOrderEvent = sequelize.define('maintenanceOrderEvent', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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
  })

  MaintenanceOrderEvent.associate = (models) => {
    models.maintenanceOrderEvent.belongsTo(models.maintenanceOrder, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrderEvent.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrderEvent.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return MaintenanceOrderEvent
}

module.exports = MaintenanceOrderEvent

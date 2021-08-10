const Sequelize = require('sequelize')

const MaintenanceOrder = (sequelize) => {
  const MaintenanceOrder = sequelize.define('maintenanceOrder', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    plateHorse: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    plateCart: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    fleet: {
      type: Sequelize.STRING,
      allowNull: true
    },
    maintenanceDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    costCenter: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    priority: {
      type: Sequelize.ENUM(['low', 'medium', 'high']),
      allowNull: false,
      defaultValue: 'low',
    },
    service: {
      type: Sequelize.ENUM(['preventive', 'corrective']),
      allowNull: false,
      defaultValue: 'preventive',
    },
    serviceDescription: {
      type: Sequelize.STRING,
      allowNull: false,
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
  
  MaintenanceOrder.associate = (models) => {
    models.maintenanceOrder.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrder.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrder.belongsTo(models.operation, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrder.hasMany(models.maintenanceOrderEvent, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrder.hasMany(models.supply, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrder.hasMany(models.maintenanceOrderDriver, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.maintenanceOrder.belongsToMany(models.driver, {
      through: 'maintenanceOrderDriver'
    })
  }

  return MaintenanceOrder
}

module.exports = MaintenanceOrder

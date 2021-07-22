const Sequelize = require('sequelize')

const Supply = (sequelize) => {
  const Supply = sequelize.define('supply', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    fuel: {
      type: Sequelize.ENUM([
        'diesel',
        'arlar',
      ]),
      allowNull: false,
      defaultValue: 'diesel',
    },
    km: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    totalLiters: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    odometer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })
  
  Supply.associate = (models) => {
    models.supply.belongsTo(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.supply.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.supply.belongsTo(models.driver, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.supply.belongsTo(models.maintenanceOrder, {
      foreignKey: {
        allowNull: false,
      }
    })

  }

  return Supply
}

module.exports = Supply

const Sequelize = require('sequelize')

const Authorization = (sequelize) => {
  const Authorization = sequelize.define('authorization', {
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
  
  Authorization.associate = (models) => {
    models.authorization.belongsTo(models.driver, {
      foreignKey: {
        unique: 'uniqueKeyAuthorization',
        allowNull: false,
      }
    })

    models.authorization.belongsTo(models.operation, {
      foreignKey: {
        unique: 'uniqueKeyAuthorization',
        allowNull: false,
      }
    })

    models.authorization.belongsTo(models.vehicle, {
      foreignKey: {
        unique: 'uniqueKeyAuthorization',
        allowNull: false,
      }
    })
  }

  return Authorization
}

module.exports = Authorization

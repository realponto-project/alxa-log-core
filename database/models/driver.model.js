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
    },
    authorizationOnboarding: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expireDriverLicense: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    rg: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '12.345678-9'
    },
    cpf: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '123.456789-10'
    },
    expireASO: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    protocolInsuranceCompany: {
      type: Sequelize.STRING,
      allowNull: true
    },
    expireProtocolInsuranceCompany: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    mop: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    bond: {
      type: Sequelize.ENUM([
        'AGREGADO',
        'FROTA',
        'TERCEIRO',
        'TERCEIRO FIDELIZADO'
      ]),
      allowNull: false,
      defaultValue: 'FROTA'
    },
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

    models.driver.hasMany(models.authorization, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Driver
}

module.exports = Driver

const { replace } = require('ramda');
const Sequelize = require('sequelize')

const Company = (sequelize) => {
  const Company = sequelize.define('company', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue('document', replace(/\D/g, '', value));
      }
    },
    type: {
      type: Sequelize.ENUM(['filial', 'matriz']),
      allowNull: false,
      defaultValue: 'filial'
    },
    zipcode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    streetNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    neighborhood: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  Company.associate = (models) => {
    models.company.hasMany(models.maintenanceOrder, {
      foreignKey: {
        allowNull: false,
      }
    })
    models.company.belongsTo(models.companyGroup, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Company
}

module.exports = Company

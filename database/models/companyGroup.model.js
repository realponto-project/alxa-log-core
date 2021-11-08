const Sequelize = require('sequelize')

const CompanyGroup = (sequelize) => {
  const CompanyGroup = sequelize.define('companyGroup', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  CompanyGroup.associate = (models) => {
    models.companyGroup.hasMany(models.company, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return CompanyGroup
}

module.exports = CompanyGroup

const Sequelize = require('sequelize')

const Models = require('./models')
const sequelizeConfig = require('../config/database')

const env = process.env.NODE_ENV || 'development'
const config = sequelizeConfig[env]

let sequelize = null
const { DATABASE_URL } = process.env

if (config.use_env_variable) {
  sequelize = new Sequelize(
    `${process.env[config.use_env_variable]}?sslmode=require`,
    config
  )
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

const ModelInstances = Models.map(model => model(sequelize))
ModelInstances
  .forEach(
    modelInstance =>
      modelInstance.associate &&
      modelInstance.associate(sequelize.models)
  )

module.exports = sequelize
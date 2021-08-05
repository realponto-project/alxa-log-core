const AuthenticationController = require('./authentication')
const authorizationController = require('./authorization')
const companyController = require('./company')
const userController = require('./user')
const operationController = require('./operation')
const vehicleTypeController = require('./vehicleType')
const vehicleController = require('./vehicle')
const driverController = require('./driver')
const mobileDriverController = require('./mobileDriver')
const maintenanceOrderController = require('./maintenanceOrder')
const trackController = require('./track')

module.exports = {
  AuthenticationController,
  authorizationController,
  companyController,
  userController,
  operationController,
  vehicleTypeController,
  vehicleController,
  driverController,
  mobileDriverController,
  maintenanceOrderController,
  trackController
}

const AuthenticationController = require('./authentication')
const authorizationController = require('./authorization')
const companyController = require('./company')
const userController = require('./user')
const operationController = require('./operation')
const vehicleTypeController = require('./vehicleType')
const vehicleController = require('./vehicle')
const driverController = require('./driver')
const driverIncidentController = require('./driverIncident')
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
  driverIncidentController,
  mobileDriverController,
  maintenanceOrderController,
  trackController
}

const AuthenticationController = require('./authentication')
const companyController = require('./company')
const userController = require('./user')
const operationController = require('./operation')
const vehicleTypeController = require('./vehicleType')
const vehicleController = require('./vehicle')
const driverController = require('./driver')
const maintenanceOrderController = require('./maintenanceOrder')

module.exports = {
  AuthenticationController,
  companyController,
  userController,
  operationController,
  vehicleTypeController,
  vehicleController,
  driverController,
  maintenanceOrderController
}

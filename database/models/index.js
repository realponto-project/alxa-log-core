const Authorization = require('./authorization.model')
const User = require('./user.model')
const Company = require('./company.model')
const CompanyGroup = require('./companyGroup.model')
const Operation = require('./operation.model')
const VehicleType = require('./vehicleType.model')
const Vehicle = require('./vehicle.model')
const Driver = require('./driver.model')
const MaintenanceOrder = require('./maintenanceOrder.model')
const MaintenanceOrderEvent = require('./maintenanceOrderEvent.model')
const MaintenanceOrderDriver = require('./maintenanceOrderDriver.model')
const DriverIncident = require('./driverIncident.model')
const Supply = require('./supply.model')
const Track = require('./track.model')

module.exports = [
  Authorization,
  Company,
  CompanyGroup,
  User,
  Operation,
  VehicleType,
  Vehicle,
  Driver,
  MaintenanceOrderDriver,
  MaintenanceOrderEvent,
  Supply,
  MaintenanceOrder,
  DriverIncident,
  Track,
]

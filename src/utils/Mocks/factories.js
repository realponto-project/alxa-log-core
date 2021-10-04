const { factory } = require('factory-girl')
const { merge } = require('ramda')
// const { random, date } = require('faker')

const database = require('../../../database')

const {
  companyGroupFaker,
  companyFaker,
  driverFaker,
  userFaker,
  vehicleTypeFaker,
  vehicleFaker
} = require('./fakers')

const CompanyGroupModel = database.model('companyGroup')
const CompanyModel = database.model('company')
const DriverModel = database.model('driver')
const UserModel = database.model('user')
const VehicleTypeModel = database.model('vehicleType')
const VehicleModel = database.model('vehicle')

factory.define('companyGroup', CompanyGroupModel, companyGroupFaker)

factory.define('company', CompanyModel, (attrs) =>
  companyFaker(
    merge(
      {
        companyGroupId: factory.assoc('companyGroup', 'id')
      },
      attrs
    )
  )
)

factory.define('driver', DriverModel, (attrs) =>
  driverFaker(
    merge(
      {
        companyId: factory.assoc('company', 'id'),
        userId: factory.assoc('user', 'id')
      },
      attrs
    )
  )
)

factory.define('user', UserModel, (attrs) =>
  userFaker(
    merge(
      {
        companyId: factory.assoc('company', 'id')
      },
      attrs
    )
  )
)

factory.define('vehicleType', VehicleTypeModel, (attrs) =>
  vehicleTypeFaker(
    merge(
      {
        companyId: factory.assoc('company', 'id'),
        userId: factory.assoc('user', 'id')
      },
      attrs
    )
  )
)

factory.define('vehicle', VehicleModel, (attrs) =>
  vehicleFaker(
    merge(
      {
        companyId: factory.assoc('company', 'id'),
        userId: factory.assoc('user', 'id'),
        vehicleTypeId: factory.assoc('vehicleType', 'id')
      },
      attrs
    )
  )
)

module.exports = factory

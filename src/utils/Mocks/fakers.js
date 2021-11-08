const faker = require('faker')
const { merge, concat, length, pipe, subtract, __ } = require('ramda')
const cnpj = require('@fnando/cnpj/commonjs')
const moment = require('moment')

faker.locale = 'pt_BR'

const incidentTypes = [
  'accident',
  'collision',
  'vehicle_break_down',
  'refusal_of_freight',
  'absence_without_justification',
  'absence_with_justification',
  'speeding',
  'lack_of_PPE',
  'lack_of_cargo_lashing'
]

const priorities = ['low', 'medium', 'high']

const statusMaintenanceOrder = [
  'cancel',
  'service_external',
  'awaiting_budget',
  'solicitation',
  'check-in',
  'avaiable',
  'parking',
  'courtyard',
  'awaiting_repair',
  'dock',
  'wash',
  'supply',
  'check-out',
  'external_service'
]

const lastPosition = pipe(length, subtract(__, 1))

const randomOf = (list) => {
  const random = faker.datatype.number({ min: 0, max: lastPosition(list) })

  return list[random]
}

const companyGroupFaker = (attrs) => {
  const response = {
    name: faker.company.companyName()
  }

  return merge(response, attrs)
}

const companyFaker = (attrs) => {
  const response = {
    name: faker.company.companyName(),
    zipcode: faker.address.zipCode(),
    street: faker.address.streetName(),
    streetNumber: String(faker.datatype.number({ max: 1000 })),
    neighborhood: faker.address.county(),
    city: faker.address.city(),
    state: faker.address.state(),
    document: cnpj.generate()
  }

  return merge(response, attrs)
}

const driverFaker = (attrs) => {
  const response = {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    phone: faker.phone.phoneNumberFormat(),
    driverLicense: String(
      faker.datatype.number({ max: 9999999999, min: 1000000000 })
    ),
    expireDriverLicense: faker.date.between(
      moment('01012021', 'DDMMYYYY'),
      moment('01012023', 'DDMMYYYY')
    ),
    expireASO: faker.date.between(
      moment('01012021', 'DDMMYYYY'),
      moment('01012023', 'DDMMYYYY')
    ),
    expireProtocolInsuranceCompany: faker.date.between(
      moment('01012021', 'DDMMYYYY'),
      moment('01012023', 'DDMMYYYY')
    )
  }

  return merge(response, attrs)
}

const driverIncidentFaker = (attrs) => {
  const response = {
    incidentDate: faker.date.between(
      moment('01012021', 'DDMMYYYY'),
      moment('01012023', 'DDMMYYYY')
    ),
    incidentDescription: faker.lorem.sentence(),
    // incidentDescription: faker.lorem.sentences(),
    incidentType: randomOf(incidentTypes)
  }

  return merge(response, attrs)
}

const maintenanceOrderFaker = (attrs) => {
  const response = {
    plateHorse: `${faker.lorem.word(3)}-${faker.datatype.number(9999)}`,
    plateCart: `${faker.lorem.word(3)}-${faker.datatype.number(9999)}`,
    maintenanceDate: faker.date.between(
      moment('01012021', 'DDMMYYYY'),
      moment('01012023', 'DDMMYYYY')
    ),
    fleet: faker.lorem.word(),
    costCenter: faker.lorem.word(),
    serviceDescription: faker.lorem.sentence(),
    service: randomOf(['preventive', 'corrective']),
    priority: randomOf(priorities),
    status: randomOf(statusMaintenanceOrder)
  }

  return merge(response, attrs)
}

const operationFaker = (attrs) => {
  const response = {
    name: `${faker.vehicle.manufacturer()} ${faker.address.city()}`,
    vacancy: faker.datatype.number(10)
  }

  return merge(response, attrs)
}

const userFaker = (attrs) => {
  const response = {
    name: faker.internet.userName(),
    document: String(faker.datatype.number()),
    password: faker.internet.password()
  }

  return merge(response, attrs)
}

const vehicleTypeFaker = (attrs) => {
  const response = {
    name: concat(faker.vehicle.type(), String(faker.datatype.number()))
  }

  return merge(response, attrs)
}

const vehicleFaker = (attrs) => {
  const response = {
    plate: `${faker.lorem.word(3)}-${faker.datatype.number(9999)}`,
    fleet: faker.lorem.word()
  }

  return merge(response, attrs)
}

module.exports = {
  companyGroupFaker,
  companyFaker,
  driverFaker,
  driverIncidentFaker,
  maintenanceOrderFaker,
  operationFaker,
  userFaker,
  vehicleTypeFaker,
  vehicleFaker
}

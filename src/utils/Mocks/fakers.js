const faker = require('faker')
const { merge, concat } = require('ramda')
const cnpj = require('@fnando/cnpj/commonjs')
const moment = require('moment')

faker.locale = 'pt_BR'

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

module.exports = {
  companyGroupFaker,
  companyFaker,
  driverFaker,
  userFaker,
  vehicleTypeFaker,
  vehicleFaker
}

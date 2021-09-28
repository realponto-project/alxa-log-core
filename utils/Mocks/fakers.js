const faker = require('faker')
const { merge, concat } = require('ramda')
const cnpj = require('@fnando/cnpj/commonjs')

faker.locale = 'pt_BR'

const companyGroupFaker = (attrs) => {
  const response = {
    name: faker.company.companyName(),
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
    document: cnpj.generate(),
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

module.exports = {
  companyGroupFaker,
  companyFaker,
  userFaker,
  vehicleTypeFaker
}

const faker = require('faker')
const { merge } = require('ramda')
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

module.exports = {
  companyGroupFaker,
  companyFaker
}

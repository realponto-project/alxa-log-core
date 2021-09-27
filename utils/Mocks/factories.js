const { factory } = require('factory-girl')
// const { random, date } = require('faker')

const database = require('../../database')

const { companyGroupFaker, companyFaker } = require('./fakers')

const CompanyGroupModel = database.model('companyGroup')
const CompanyModel = database.model('company')

factory.define('companyGroup', CompanyGroupModel, companyGroupFaker)

factory.define('company', CompanyModel, companyFaker )

module.exports = factory

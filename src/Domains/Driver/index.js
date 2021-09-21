const { propOr, applySpec, always, concat } = require('ramda')

const database = require('../../../database')
const { buildWhere, buildQueryPagnation } = require('../../utils')

const DriverModel = database.model('driver')
const CompanyModel = database.model('company')

class DomainDriver {
  async create(driver, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await DriverModel.create(driver, { transaction })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const driver = await DriverModel.findByPk(id)

    if (!driver) throw new Error('Driver not found')

    const response = await driver.update(values, { transaction })

    return response
  }

  async getById(id) {
    const response = await DriverModel.findByPk(id)

    return response
  }

  async getAll(query) {
    const whereProps = [
      ['name', 'iLike'],
      ['driverLicense', 'iLike'],
      ['expireDriverLicense', 'rangeDate'],
      ['expireASO', 'rangeDate'],
      ['expireProtocolInsuranceCompany', 'rangeDate']
    ]

    const buildQuery = applySpec({
      where: buildWhere(whereProps),
      include: applySpec({
        model: always(CompanyModel),
        where: buildWhere(['companyGroupId'])
      })
    })

    const { where, include } = buildQuery(query)

    const response = await DriverModel.findAndCountAll({
      ...buildQueryPagnation(query),
      order: [["name", "ASC"]],
      where,
      include
    })

    const countExpireDriverLicense = await DriverModel.count({
      include,
      where: buildWhere(
        concat(whereProps, [['expireDriverLicense', 'lteToday']])
      )(query)
    })
    const countExpireProtocolInsuranceCompany = await DriverModel.count({
      include,
      where: buildWhere(
        concat(whereProps, [['expireProtocolInsuranceCompany', 'lteToday']])
      )(query)
    })
    const countExpireASO = await DriverModel.count({
      include,
      where: buildWhere(concat(whereProps, [['expireASO', 'lteToday']]))(query)
    })

    return {
      ...response,
      countExpireDriverLicense,
      countExpireProtocolInsuranceCompany,
      countExpireASO
    }
  }
}

module.exports = new DomainDriver()

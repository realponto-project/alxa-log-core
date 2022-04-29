const { propOr } = require('ramda')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const CompanyModel = database.model('company')

class DomainCompany {
  async create(company, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await CompanyModel.create(company, { transaction })

    return response
  }

  async getAll(query) {
    const where = buildWhere(['companyGroupId', 'document', ['name', 'iLike']])(
      query
    )

    const response = await CompanyModel.findAndCountAll({
      ...buildQueryPagnation(query),
      where
    })

    return response
  }

  async getById(id) {
    const response = await CompanyModel.findByPk(id)

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const company = await CompanyModel.findByPk(id)

    if (!company) throw new Error('Company not found')

    const response = await company.update(values, { transaction })

    return response
  }
}

module.exports = new DomainCompany()

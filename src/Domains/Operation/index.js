const { propOr, applySpec, always } = require('ramda')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const OperationModel = database.model('operation')
const CompanyModel = database.model('company')

class DomainOperation {
  async create(operation, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await OperationModel.create(operation, { transaction })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const operation = await OperationModel.findByPk(id)

    if (!operation) throw new Error('Operation not found')

    const response = await operation.update(values, { transaction })

    return response
  }

  async getById(id) {
    const response = await OperationModel.findByPk(id, {
      include: CompanyModel
    })

    return response
  }

  async getAll(query) {
    const buildQuery = applySpec({
      where: buildWhere([['name', 'iLike']]),
      include: applySpec({
        model: always(CompanyModel),
        where: buildWhere(['companyGroupId'])
      })
    })

    const response = await OperationModel.findAndCountAll({
      ...buildQueryPagnation(query),
      ...buildQuery(query)
    })

    return response
  }
}

module.exports = new DomainOperation()

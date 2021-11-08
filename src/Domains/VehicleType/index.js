const { propOr, applySpec, always } = require('ramda')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')
const { Api404Error } = require('../../utils/Errors')

const CompanyModel = database.model('company')
const VehicleTypeModel = database.model('vehicleType')

class DomainVehicleType {
  async create(vehicleType, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await VehicleTypeModel.create(vehicleType, { transaction })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const vehicleType = await VehicleTypeModel.findByPk(id)

    if (!vehicleType) throw new Api404Error('Vehicle type not found')

    const response = await vehicleType.update(values, { transaction })

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

    const response = await VehicleTypeModel.findAndCountAll({
      ...buildQueryPagnation(query),
      ...buildQuery(query)
    })

    return response
  }

  async getById(id) {
    const response = await VehicleTypeModel.findByPk(id)

    return response
  }
}

module.exports = new DomainVehicleType()

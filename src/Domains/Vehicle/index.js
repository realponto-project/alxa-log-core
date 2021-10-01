const { propOr, applySpec, pipe, always, __, insertAll } = require('ramda')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const CompanyModel = database.model('company')
const TrackModel = database.model('track')
const VehicleModel = database.model('vehicle')
const VehicleTypeModel = database.model('vehicleType')

class DomainVehicle {
  async create(vehicle, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await VehicleModel.create(vehicle, { transaction })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const vehicle = await VehicleModel.findByPk(id)

    if (!vehicle) throw new Error('Vehicle not found')

    const response = await vehicle.update(values, { transaction })

    return response
  }

  async getById(id) {
    const vehicle = await VehicleModel.findByPk(id, {
      include: [
        VehicleTypeModel,
        {
          model: TrackModel,
          limit: 1,
          order: [['createdAt', 'DESC']]
        }
      ]
    })

    return vehicle
  }

  async getAll(query) {
    const buildQuery = applySpec({
      where: buildWhere([
        ['plate', 'iLike'],
        ['fleet', 'iLike']
      ]),
      include: pipe(
        applySpec({
          model: always(CompanyModel),
          where: buildWhere(['companyGroupId'])
        }),
        insertAll(0, __, [VehicleTypeModel])
      )
    })

    const vehicles = await VehicleModel.findAndCountAll({
      ...buildQueryPagnation(query),
      ...buildQuery(query)
    })

    return vehicles
  }
}

module.exports = new DomainVehicle()

const { propOr, applySpec, pipe, always, insertAll, __ } = require('ramda')
const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const DriverIncidentModel = database.model('driverIncident')
const CompanyModel = database.model('company')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')

class DomainDriverIncident {
  async create(driverIncident, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await DriverIncidentModel.create(driverIncident, {
      transaction
    })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const incident = await DriverIncidentModel.findByPk(id)

    if (!incident) throw new Error('Driver  incident not found')

    const response = await incident.update(values, { transaction })

    return response
  }

  async getAll(options) {
    const buildQuery = applySpec({
      where: buildWhere([
        'driverId',
        'operationId',
        'incidentType',
        ['dates', 'rangeDate', 'incidentDate']
      ]),
      include: pipe(
        applySpec({
          model: always(VehicleModel),
          where: buildWhere([['plate', 'iLike']])
        }),
        insertAll(0, __, [
          {
            model: OperationModel,
            include: CompanyModel
          }
        ])
      )
    })

    const query = buildQuery(options)
    const pagnation = buildQueryPagnation(options)

    const response = await DriverIncidentModel.findAndCountAll({
      ...pagnation,
      ...query
    })

    return response
  }
}

module.exports = new DomainDriverIncident()

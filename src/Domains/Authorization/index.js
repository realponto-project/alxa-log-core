const { propOr, applySpec, pipe, always, insertAll, __ } = require('ramda')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const AuthorizationModel = database.model('authorization')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')

class DomainAuthorization {
  async create(authorization, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await AuthorizationModel.create(authorization, {
      transaction
    })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const authorization = await AuthorizationModel.findByPk(id)

    if (!authorization) throw new Error('Authorization not found')

    const response = await authorization.update(values, { transaction })

    return response
  }

  async getById(id) {
    const response = await AuthorizationModel.findByPk(id)

    return response
  }

  async getAll(options) {
    const buildQuery = applySpec({
      where: buildWhere(['operationId', 'driverId', ['activated', 'or']]),
      include: pipe(
        applySpec({
          model: always(VehicleModel),
          where: buildWhere([['plate', 'iLike']])
        }),
        insertAll(0, __, [OperationModel])
      )
    })

    const pagnation = buildQueryPagnation(options)
    const query = buildQuery(options)

    const response = await AuthorizationModel.findAndCountAll({
      ...pagnation,
      ...query
    })

    return response
  }
}

module.exports = new DomainAuthorization()

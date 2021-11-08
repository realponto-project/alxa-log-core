const { propOr, applySpec, always, pipe, insertAll, __ } = require('ramda')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const MaintenanceOrderModel = database.model('maintenanceOrder')
const MaintenanceOrderDriverModel = database.model('maintenanceOrderDriver')
const MaintenanceOrderEventModel = database.model('maintenanceOrderEvent')
const VehicleModel = database.model('vehicle')
const SupplyModel = database.model('supply')
const CompanyModel = database.model('company')
const DriverModel = database.model('driver')
const OperationModel = database.model('operation')
const UserModel = database.model('user')

class DomainMaintenanceOrder {
  async create(maintenanceOrder, options = {}) {
    const transaction = propOr(null, 'transaction', options)
    const plate = propOr(null, 'plateCart', maintenanceOrder)

    const findOrder = await MaintenanceOrderModel.findOne({
      where: {
        plateCart: plate,
        activated: true
      }
    })

    if (findOrder) {
      throw new Error('Allow only one order for this plate!')
    }

    const vehicle = await VehicleModel.findOne({
      where: { plate },
      attributes: ['fleet'],
      transaction
    })

    maintenanceOrder.fleet = vehicle ? vehicle.fleet : ''

    const response = await MaintenanceOrderModel.create(maintenanceOrder, {
      transaction
    })

    await MaintenanceOrderDriverModel.create(
      { maintenanceOrderId: response.id, driverId: maintenanceOrder.driverId },
      { transaction }
    )
    await MaintenanceOrderEventModel.create(
      {
        userId: maintenanceOrder.userId,
        companyId: maintenanceOrder.companyId,
        maintenanceOrderId: response.id
      },
      { transaction }
    )

    return response
  }

  async update(id, values, options) {
    const transaction = propOr(null, 'transaction', options)

    const maintenanceOrder = await MaintenanceOrderModel.findByPk(id)

    if (!maintenanceOrder) throw new Error('Maintenance order not found')

    const response = await maintenanceOrder.update(values, { transaction })

    return response
  }

  async getById(id) {
    const response = await MaintenanceOrderModel.findByPk(id, {
      include: [
        CompanyModel,
        {
          model: MaintenanceOrderEventModel,
          include: [{ model: UserModel, attributes: ['id', 'name'] }]
        },
        SupplyModel,
        { model: MaintenanceOrderDriverModel, include: [DriverModel] },
        { model: OperationModel, include: [CompanyModel] }
      ]
    })

    return response
  }

  async getAll(options) {
    const pagnation = buildQueryPagnation(options)
    const buildQuery = applySpec({
      where: buildWhere([
        'companyId',
        ['dates', 'rangeDate', 'maintenanceDate'],
        ['priorities', 'or', 'priority'],
        ['services', 'or', 'service'],
        ['status', 'or'],
        ['plate', 'iLike', 'plateCart']
      ]),
      include: always([
        CompanyModel,
        { model: MaintenanceOrderEventModel, required: true },
        {
          model: MaintenanceOrderDriverModel,
          include: [DriverModel]
        }
      ]),
      order: always([['maintenanceDate', 'DESC']])
    })

    const query = buildQuery(options)

    const count = await MaintenanceOrderModel.count({ where: query.where })

    const rows = await MaintenanceOrderModel.findAll({
      ...pagnation,
      ...query
    })

    const response = { count, rows }

    return response
  }
}

module.exports = new DomainMaintenanceOrder()

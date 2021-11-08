const moment = require('moment')
const { pathOr, pipe, multiply } = require('ramda')
const Sequelize = require('sequelize')

const database = require('../../../database')
const domainMaintenanceOrder = require('../../Domains/MaintenanceOrder')

const MaintenanceOrderModel = database.model('maintenanceOrder')
const MaintenanceOrderEventModel = database.model('maintenanceOrderEvent')
const MaintenanceOrderDriverModel = database.model('maintenanceOrderDriver')
const SupplyModel = database.model('supply')
const CompanyModel = database.model('company')
const DriverModel = database.model('driver')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')
const AuthorizationModel = database.model('authorization')

const { Op } = Sequelize
const { or, iLike, eq, gte, lte } = Op

const statusQuantityAllow = {
  cancel: 1,
  solicitation: 1,
  'check-in': 1,
  avaiable: 1,
  parking: 4,
  courtyard: 10,
  awaiting_repair: 10,
  dock: 10,
  wash: 1,
  supply: 2,
  'check-out': 1,
  external_service: 1
}

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  const transaction = await database.transaction()
  try {
    const response = await domainMaintenanceOrder.create(
      { ...req.body, userId, companyId },
      { transaction }
    )

    await transaction.commit()

    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()

  try {
    const response = await domainMaintenanceOrder.update(
      req.params.id,
      req.body,
      { transaction }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await domainMaintenanceOrder.getById(req.params.id)

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await domainMaintenanceOrder.getAll({
      ...req.query,
      companyId
    })

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAllCompanyId = async (req, res, next) => {
  const companyId = pathOr(null, ['query', 'companyId'], req)

  try {
    const response = await domainMaintenanceOrder.getAll({
      ...req.query,
      companyId
    })

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const buildQuery = ({
  plate,
  status,
  services,
  priorities,
  dates,
  companyId,
  operationId
}) => {
  let where = {}

  if (companyId) {
    where = {
      ...where,
      companyId
    }
  }

  if (operationId) {
    where = {
      ...where,
      operationId
    }
  }

  if (plate) {
    where = {
      ...where,
      [or]: [
        {
          plateCart: {
            [iLike]: '%' + plate + '%'
          }
        }
      ]
    }
  }

  if (status.length > 0) {
    where = {
      ...where,
      status: { [or]: status }
    }
  }

  if (services.length > 0) {
    where = {
      ...where,
      service: { [or]: services }
    }
  }

  if (priorities.length > 0) {
    where = {
      ...where,
      priority: { [or]: priorities }
    }
  }

  if (dates.length > 0) {
    where = {
      ...where,
      maintenanceDate: {
        [gte]: moment(dates[0]).startOf('day').toISOString(),
        [lte]: moment(dates[1]).endOf('day').toISOString()
      }
    }
  }

  return where
}

const getAllOperationId = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pipe(
    pathOr('0', ['query', 'offset']),
    Number,
    multiply(limit)
  )(req)
  const operationId = pathOr(null, ['query', 'operationId'], req)

  const plate = pathOr(null, ['query', 'plate'], req)
  const status = pathOr([], ['query', 'status'], req)
  const services = pathOr([], ['query', 'services'], req)
  const priorities = pathOr([], ['query', 'priorities'], req)
  const dates = pathOr([], ['query', 'dates'], req)

  const where = buildQuery({
    plate,
    status,
    services,
    priorities,
    dates,
    operationId
  })

  try {
    const count = await MaintenanceOrderModel.count({ where })
    const rows = await MaintenanceOrderModel.findAll({
      where,
      include: [
        CompanyModel,
        {
          model: MaintenanceOrderEventModel,
          limit: 1,
          where: { status: 'check-in' }
        },
        { model: MaintenanceOrderDriverModel, include: [DriverModel], limit: 1 }
      ],
      order: [['maintenanceDate', 'DESC']],
      offset,
      limit
    })

    res.json({ rows, count })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const createEventToMaintenanceOrder = async (req, res, next) => {
  const maintenanceOrderId = pathOr(null, ['params', 'id'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const status = pathOr(null, ['body', 'status'], req)
  const transaction = await database.transaction()
  let payload = pathOr({}, ['body'], req)

  try {
    const response = await MaintenanceOrderModel.findByPk(maintenanceOrderId, {
      include: [
        MaintenanceOrderEventModel,
        SupplyModel,
        { model: MaintenanceOrderDriverModel, include: [DriverModel] }
      ],
      transaction
    })
    const eventsCreated = await MaintenanceOrderEventModel.count({
      where: { status, maintenanceOrderId }
    })

    if (response.status === 'check-out') {
      throw new Error('Order finished, you cant set other state!')
    }

    if (
      eventsCreated === statusQuantityAllow[status] &&
      response.status !== 'check-out'
    ) {
      throw new Error(
        `Allow only ${statusQuantityAllow[status]} to the event ${status}`
      )
    }

    if (
      response.status === 'solicitation' &&
      !(status === 'check-in' || status === 'cancel')
    ) {
      throw new Error(
        `Not allowed created this status ${status} event to order with status solicitation`
      )
    }

    await MaintenanceOrderEventModel.create(
      { userId, companyId, maintenanceOrderId, status },
      { transaction }
    )

    if (status === 'check-out') {
      const drivers = await MaintenanceOrderDriverModel.findAll({
        where: { maintenanceOrderId },
        transaction,
        raw: true
      })

      if (drivers.length !== 2) {
        throw new Error(`Don't have a second driver`)
      }

      payload = {
        ...payload,
        activated: false
      }
      const fincVehicle = await VehicleModel.findOne({
        where: { plate: response.plateCart },
        transaction
      })
      if (fincVehicle) {
        await fincVehicle.update(
          { lastMaintenance: new Date() },
          { transaction }
        )
      }
    }

    if (status === 'supply') {
      await SupplyModel.create(
        { ...req.body, maintenanceOrderId, userId, companyId },
        { transaction }
      )
    }

    await response.update(payload, { transaction })
    await response.reload({ transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getByIdMobile = async (req, res, next) => {
  try {
    const response = await MaintenanceOrderModel.findByPk(req.params.id, {
      include: [
        CompanyModel,
        { model: MaintenanceOrderDriverModel, include: [DriverModel] }
      ]
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const buildQuerySummary = ({ dates, companyId }) => {
  const where = {}

  if (companyId) where.companyId = companyId

  if (dates) {
    where.createdAt = {
      [gte]: moment(dates.start).startOf('day').toISOString(),
      [lte]: moment(dates.end).endOf('day').toISOString()
    }
  }

  return where
}

const getSummaryOrderByStatus = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const where = buildQuerySummary({ ...req.query, companyId })

  try {
    const response = await MaintenanceOrderModel.findAll({
      where,
      attributes: [
        'status',
        [
          Sequelize.fn('date_trunc', 'day', Sequelize.col('maintenanceDate')),
          'name'
        ],
        [Sequelize.fn('COUNT', Sequelize.col('maintenanceDate')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('maintenanceDate')),
        'status'
      ]
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getSummaryOrderByCompany = async (req, res, next) => {
  try {
    const response = await MaintenanceOrderModel.findAll({
      include: [CompanyModel],
      attributes: [
        'status',
        [
          Sequelize.fn(
            'date_trunc',
            'day',
            Sequelize.col('maintenanceOrder.maintenanceDate')
          ),
          'name'
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.col('maintenanceOrder.maintenanceDate')
          ),
          'count'
        ]
      ],
      group: [
        Sequelize.fn(
          'date_trunc',
          'day',
          Sequelize.col('maintenanceOrder.maintenanceDate')
        ),
        'status',
        'company.id'
      ]
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getSummaryOrderByOperation = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const where = buildQuerySummary({ ...req.query, companyId })

  try {
    const response = await MaintenanceOrderModel.findAll({
      where,
      include: [{ model: OperationModel, include: [CompanyModel] }],
      attributes: [
        'status',
        [
          Sequelize.fn(
            'date_trunc',
            'day',
            Sequelize.col('maintenanceOrder.maintenanceDate')
          ),
          'name'
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.col('maintenanceOrder.maintenanceDate')
          ),
          'count'
        ]
      ],
      group: [
        Sequelize.fn(
          'date_trunc',
          'day',
          Sequelize.col('maintenanceOrder.maintenanceDate')
        ),
        'status',
        'operation.id',
        'operation.company.id'
      ]
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getByPlate = async (req, res, next) => {
  const plate = pathOr(null, ['query', 'plate'], req)
  const where = plate
    ? {
        plateCart: {
          [eq]: plate
        },
        activated: true
      }
    : {}

  try {
    const response = await MaintenanceOrderModel.findOne({
      where,
      include: [
        CompanyModel,
        { model: MaintenanceOrderDriverModel, include: [DriverModel] }
      ]
    })
    if (!response) {
      throw new Error('cannot find order!')
    }
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const associateDriver = async (req, res, next) => {
  const driverId = pathOr(null, ['body', 'driverId'], req)
  const maintenanceOrderId = pathOr(null, ['body', 'maintenanceOrderId'], req)
  const transaction = await database.transaction()

  try {
    const response = await MaintenanceOrderDriverModel.create(
      { driverId, maintenanceOrderId },
      { transaction }
    )

    const maintenanceOrderDrives = await MaintenanceOrderDriverModel.findAll({
      where: { maintenanceOrderId },
      transaction
    })

    if (maintenanceOrderDrives.length > 2) {
      throw new Error('One maintenance order not can have than two drivers')
    }
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error })
  }
}

const updateAssociateDriver = async (req, res, next) => {
  const driverId = pathOr(null, ['body', 'driverId'], req)
  const maintenanceOrderId = pathOr(null, ['body', 'maintenanceOrderId'], req)
  const transaction = await database.transaction()

  try {
    const maintenanceOrderDrives = await MaintenanceOrderDriverModel.findAll({
      where: { maintenanceOrderId },
      transaction
    })

    if (maintenanceOrderDrives.length === 1) {
      throw new Error('Maintenance order not have a output driver')
    }
    if (maintenanceOrderDrives.length > 2) {
      throw new Error('One maintenance order not can have than two drivers')
    }

    const maintenanceOrderDriveOut = maintenanceOrderDrives[1]

    const response = await maintenanceOrderDriveOut.update(
      { driverId },
      { transaction }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error })
  }
}

const updateCancel = async (req, res, next) => {
  const maintenanceOrderId = pathOr(null, ['params', 'id'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const status = pathOr(null, ['body', 'status'], req)
  const transaction = await database.transaction()
  const payload = pathOr({}, ['body'], req)

  try {
    const response = await MaintenanceOrderModel.findByPk(maintenanceOrderId, {
      include: [{ model: MaintenanceOrderDriverModel, include: [DriverModel] }],
      transaction
    })
    const eventsCreated = await MaintenanceOrderEventModel.count({
      where: { status, maintenanceOrderId }
    })

    if (response.status === 'check-out' || response.status === 'cancel') {
      throw new Error('Order finished, you cant set other state!')
    }

    if (
      eventsCreated === statusQuantityAllow[status] &&
      response.status !== 'check-out'
    ) {
      throw new Error(
        `Allow only ${statusQuantityAllow[status]} to the event ${status}`
      )
    }

    await MaintenanceOrderEventModel.create(
      { userId, companyId, maintenanceOrderId, status },
      { transaction }
    )

    await response.update({ ...payload, activated: false }, { transaction })
    await response.reload({ transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const createByAuthorization = async (req, res, next) => {
  const transaction = await database.transaction()
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const { body } = req

  try {
    const authorization = await AuthorizationModel.findByPk(
      body.authorizationId,
      {
        include: [DriverModel, VehicleModel],
        transaction
      }
    )

    if (!authorization) throw new Error('Authorization not found')

    const findOrder = await MaintenanceOrderModel.findOne({
      where: {
        plateCart: authorization.vehicle.plate,
        activated: true
      },
      transaction
    })

    if (findOrder) {
      throw new Error('Allow only one order for this plate!')
    }

    const payload = {
      activated: true,
      maintenanceDate: new Date(),
      plateHorse: pathOr('', ['vehicle', 'plate'], authorization),
      plateCart: pathOr('', ['vehicle', 'plate'], authorization),
      fleet: pathOr('', ['vehicle', 'fleet'], authorization),
      costCenter: '',
      priority: 'low',
      serviceDescription: '',
      status: 'check-in',
      companyId,
      userId,
      operationId: authorization.operationId,
      service: 'preventive'
    }

    const maintenanceOrderCreated = await MaintenanceOrderModel.create(
      payload,
      { transaction }
    )
    await MaintenanceOrderEventModel.create(
      { userId, companyId, maintenanceOrderId: maintenanceOrderCreated.id },
      { transaction }
    )
    await MaintenanceOrderDriverModel.create(
      {
        maintenanceOrderId: maintenanceOrderCreated.id,
        driverId: authorization.driverId
      },
      { transaction }
    )

    const response = await MaintenanceOrderModel.findByPk(
      maintenanceOrderCreated.id,
      {
        include: [DriverModel],
        transaction
      }
    )

    await transaction.commit()
    res.json(response)
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  getAllCompanyId,

  getAllOperationId,

  createEventToMaintenanceOrder,
  getByIdMobile,
  getSummaryOrderByStatus,
  getSummaryOrderByCompany,
  getSummaryOrderByOperation,
  getByPlate,

  associateDriver,
  updateAssociateDriver,
  updateCancel,
  createByAuthorization
}
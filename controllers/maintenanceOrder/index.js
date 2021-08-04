const { pathOr } = require('ramda')
const database = require('../../database')
const MaintenanceOrderModel = database.model('maintenanceOrder')
const MaintenanceOrderEventModel = database.model('maintenanceOrderEvent')
const MaintenanceOrderDriverModel = database.model('maintenanceOrderDriver')
const SupplyModel = database.model('supply')
const CompanyModel = database.model('company')
const DriverModel = database.model('driver')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { or, iLike, eq, and, gte, lte } = Op
const moment = require('moment')

const statusQuantityAllow = {
  'cancel': 1,
  'solicitation': 1,
  'check-in': 1,
  'avaiable': 1,
  'parking': 4,
  'courtyard': 10,
  'awaiting_repair': 10,
  'dock': 10,
  'wash': 1,
  'supply': 2,
  'check-out': 1,
}

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const plateCart = pathOr(null, ['body', 'plateCart'], req)

  const transaction = await database.transaction()
  try {
    const vehicle = await VehicleModel.findOne({ plate: plateCart }, { transaction })

    const findOrder = await MaintenanceOrderModel.findOne({ where: {
        plateCart,
        activated: true
      },
    })

    if (findOrder) {
      throw new Error ('Allow only one order for this plate!')
    }

    const payload = await MaintenanceOrderModel.create({...req.body, fleet: vehicle ? vehicle.fleet : '', userId }, { include:[MaintenanceOrderEventModel, CompanyModel], transaction })
    const response = await MaintenanceOrderModel.findByPk(payload.id, { include:[MaintenanceOrderEventModel, CompanyModel], transaction })
    await MaintenanceOrderDriverModel.create({ maintenanceOrderId: payload.id, driverId: req.body.driverId }, { transaction })
    await MaintenanceOrderEventModel.create({ userId, companyId, maintenanceOrderId: payload.id }, { transaction })
    await response.reload({ include: [MaintenanceOrderEventModel, CompanyModel], transaction })
    await transaction.commit()

    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const findUser = await MaintenanceOrderModel.findByPk(req.params.id, { include: [CompanyModel, MaintenanceOrderEventModel]})
    
    const vehicle = await VehicleModel.findOne({ plate: req.body.plateCart })
    await findUser.update({...req.body, fleet: vehicle ? vehicle.fleet : '' })
    const response = await findUser.reload({ include: [CompanyModel, MaintenanceOrderEventModel, { model: MaintenanceOrderDriverModel, include: [DriverModel]}]})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await MaintenanceOrderModel.findByPk(req.params.id, { include: [
      CompanyModel, 
      MaintenanceOrderEventModel, 
      SupplyModel,
      { model: MaintenanceOrderDriverModel, include: [DriverModel]},
      { model: OperationModel, include: [CompanyModel] }
    ]})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const buildQuery = (plate, status, services, priorities, dates) => {
  let where = {}
  if(plate) {
    where = {
      [or]: [
        { plateCart: {
          [iLike]: '%' + plate.replace(/\D/g, '') + '%'
        } },
        { plateHorse: {
          [iLike]: '%' + plate.replace(/\D/g, '') + '%'
        } },
      ],
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
      [and]: [{ service: { [or]: services } }]
    }
  }

  if (priorities.length > 0) {
    where = {
      ...where,
      [and]: [{ priority: { [or]: priorities } }]
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

const getAll = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const plate = pathOr(null, ['query', 'plate'], req)
  const status =  pathOr([], ['query', 'status'], req)
  const services =  pathOr([], ['query', 'services'], req)
  const priorities =  pathOr([], ['query', 'priorities'], req)
  const dates =  pathOr([], ['query', 'dates'], req)
  const where = buildQuery(plate, status, services, priorities, dates)

  try {
    const count = await MaintenanceOrderModel.count({ where })
    const rows = await MaintenanceOrderModel.findAll({ 
      where, 
      include: [
        CompanyModel,
        MaintenanceOrderEventModel, 
        { 
          model: MaintenanceOrderDriverModel, 
          include: [DriverModel]
        }
      ], 
        offset: (offset * limit), 
        limit,
        order: [
          ['maintenanceDate', 'DESC'],
        ]
      })
    res.json({ rows, count })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const createEventToMaintenanceOrder =  async (req, res, next) => {
  const maintenanceOrderId = pathOr(null, ['params', 'id'], req)
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const status = pathOr(null, ['body', 'status'], req)
  const driverId = pathOr(null, ['body', 'driverId'], req)
  const transaction = await database.transaction()
  let payload = pathOr({}, ['body'], req)

  try { 
    const response = await MaintenanceOrderModel.findByPk(maintenanceOrderId, { include: [MaintenanceOrderEventModel, SupplyModel, { model: MaintenanceOrderDriverModel, include:[DriverModel]}], transaction })
    const eventsCreated = await MaintenanceOrderEventModel.count({ where: { status, maintenanceOrderId }})
    
    if (response.status === 'check-out') {
      throw new Error('Order finished, you cant set other state!')
    }

    if (eventsCreated === statusQuantityAllow[status] && response.status !== 'check-out') {
      throw new Error(`Allow only ${statusQuantityAllow[status]} to the event ${status}`)
    }
    
    await MaintenanceOrderEventModel.create({ userId, companyId, maintenanceOrderId, status }, { transaction })

    if (status === 'check-out') {
      payload = {
        ...payload,
        activated: false,
      }
      const fincVehicle = await VehicleModel.findOne({ where: { plate: response.plateCart }, transaction })
      if (fincVehicle) {
        await fincVehicle.update({ lastMaintenance: new Date() }, { transaction })
      }
    }

    if (status === 'supply') {
      await SupplyModel.create({...req.body, maintenanceOrderId, userId, companyId }, { transaction })
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
    const response = await MaintenanceOrderModel.findByPk(req.params.id, { include: [CompanyModel, { model: MaintenanceOrderDriverModel, include: [DriverModel]}]})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getSummaryOrderByStatus = async (req, res, next) => {
  try {
    const response = await MaintenanceOrderModel.findAll({ 
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
      ],
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
          Sequelize.fn('date_trunc', 'day', Sequelize.col('maintenanceOrder.maintenanceDate')),
          'name'
        ],
        [Sequelize.fn('COUNT', Sequelize.col('maintenanceOrder.maintenanceDate')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('maintenanceOrder.maintenanceDate')),
        'status',
        'company.id'
      ],
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getSummaryOrderByOperation = async (req, res, next) => {
  try {
    const response = await MaintenanceOrderModel.findAll({ 
      include: [{ model: OperationModel, include: [CompanyModel] }],
      attributes: [
        'status',
        [
          Sequelize.fn('date_trunc', 'day', Sequelize.col('maintenanceOrder.maintenanceDate')),
          'name'
        ],
        [Sequelize.fn('COUNT', Sequelize.col('maintenanceOrder.maintenanceDate')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('maintenanceOrder.maintenanceDate')),
        'status',
        'operation.id',
        'operation.company.id'
      ],
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getByPlate = async (req, res, next) => {
  const plate = pathOr(null, ['query', 'plate'], req)
  const where = plate ? {
    plateCart: {
      [eq]: plate
    },
    activated: true,
  } : { }

  try {
    const response = await MaintenanceOrderModel.findOne({ where, include: [CompanyModel, { model: MaintenanceOrderDriverModel, include: [DriverModel] }]})
    if(!response) {
      throw new Error('cannot find order!')
    }
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAllCompanyId = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const companyId = pathOr(null, ['query', 'companyId'], req)

  try {
    const count = await MaintenanceOrderModel.count({ where: { companyId } })
    const response = await MaintenanceOrderModel.findAndCountAll({ where: { companyId }, include: [CompanyModel, MaintenanceOrderEventModel, { model: MaintenanceOrderDriverModel, include: [DriverModel] }], offset, limit })
    res.json({...response, count })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAllOperationId = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const operationId = pathOr(null, ['query', 'operationId'], req)

  try {
    const count = await MaintenanceOrderModel.count({ where: { operationId } })
    const response = await MaintenanceOrderModel.findAndCountAll({ where: { operationId }, include: [CompanyModel, MaintenanceOrderEventModel, { model: MaintenanceOrderDriverModel, include: [DriverModel] }], offset, limit })
    res.json({...response, count })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const associateDriver = async (req, res, next) => {
  const driverId = pathOr(null, ['body', 'driverId'], req)
  const maintenanceOrderId = pathOr(null, ['body', 'maintenanceOrderId'], req)
  const transaction = await database.transaction()

  try{
    const response = await MaintenanceOrderDriverModel.create({driverId, maintenanceOrderId}, { transaction })

    const maintenanceOrderDrives = await MaintenanceOrderDriverModel.findAll({ where: { maintenanceOrderId }, transaction })

    if(maintenanceOrderDrives.length > 2){
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
  
  try{
    const maintenanceOrderDrives = await MaintenanceOrderDriverModel.findAll({ where: { maintenanceOrderId }, transaction})

    if(maintenanceOrderDrives.length === 1){
      throw new Error('Maintenance order not have a output driver')
    }
    if(maintenanceOrderDrives.length > 2){
      throw new Error('One maintenance order not can have than two drivers')
    }

    const maintenanceOrderDriveOut = maintenanceOrderDrives[1]
    
    const response = await maintenanceOrderDriveOut.update({ driverId }, { transaction })

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
  let payload = pathOr({}, ['body'], req)

  try { 
    const response = await MaintenanceOrderModel.findByPk(maintenanceOrderId, { include: [{ model: MaintenanceOrderDriverModel, include:[DriverModel]}], transaction })
    const eventsCreated = await MaintenanceOrderEventModel.count({ where: { status, maintenanceOrderId }})
    
    if (response.status === 'check-out' || response.status === 'cancel') {
      throw new Error('Order finished, you cant set other state!')
    }

    if (eventsCreated === statusQuantityAllow[status] && response.status !== 'check-out') {
      throw new Error(`Allow only ${statusQuantityAllow[status]} to the event ${status}`)
    }
    
    await MaintenanceOrderEventModel.create({ userId, companyId, maintenanceOrderId, status }, { transaction })
    
    await response.update(payload, { transaction })
    await response.reload({ transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
  createEventToMaintenanceOrder,
  getByIdMobile,
  getSummaryOrderByStatus,
  getSummaryOrderByCompany,
  getSummaryOrderByOperation,
  getByPlate,
  getAllCompanyId,
  getAllOperationId,
  associateDriver,
  updateAssociateDriver,
  updateCancel
}

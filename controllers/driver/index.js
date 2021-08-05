const { pathOr } = require('ramda')
const database = require('../../database')
const DriverModel = database.model('driver')
const DriverIncidentModel = database.model('driverIncident')
const CompanyModel = database.model('company')
const UserModel = database.model('user')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')

const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await DriverModel.create({...req.body, userId, companyId, authorizationOnboarding: false }, { include: [] })
    res.json(response)
  } catch (error) {
    
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const findUser = await DriverModel.findByPk(req.params.id, { include: [] })
    await findUser.update(req.body)
    const response = await findUser.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await DriverModel.findByPk(req.params.id, { include: [{
      model: DriverIncidentModel,
      include: [
        { model: OperationModel, include: [CompanyModel] }, 
        CompanyModel,
        UserModel,
        VehicleModel
      ]
    }] })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const driverLicense = pathOr(null, ['query', 'driverLicense'], req)
  const name = pathOr(null, ['query', 'name'], req)
  const isDriverLicense = driverLicense ? { driverLicense: { [iLike]: '%' + driverLicense + '%' } } : null
  const isName = name ? { name: { [iLike]: '%' + name + '%' } } : null
  let where = {}
  
  if (isDriverLicense) {
    where = isDriverLicense
  }

  if (isName) {
    where = isName
  }

  try {
    const response = await DriverModel.findAndCountAll({ where, limit, offset: (offset * limit) })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const createIncident = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await DriverIncidentModel.create({...req.body, userId, companyId }, { include: [OperationModel, CompanyModel, UserModel, VehicleModel, DriverModel] })
    res.json(response)
  } catch (error) {
    
    res.status(400).json({ error: error.message })
  }
}

const getIncidentsSummary = async (req, res, next) => {
  const driverId = pathOr(null, ['params', 'id'], req)

  try {
    const response = await DriverIncidentModel.findAll({ 
      where: { driverId },
      attributes: [
        'incidentType',
        [
          Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')),
          'name'
        ],
        [Sequelize.fn('COUNT', Sequelize.col('createdAt')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')),
        'incidentType'
      ],
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
  createIncident,
  getIncidentsSummary,
}

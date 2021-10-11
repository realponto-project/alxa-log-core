const Sequelize = require('sequelize')
const { pathOr } = require('ramda')

const database = require('../../database')
const domainVehicle = require('../../src/Domains/Vehicle')

const VehicleModel = database.model('vehicle')
const VehicleTypeModel = database.model('vehicleType')
const TrackModel = database.model('track')
const CompanyModel = database.model('company')

const { Op } = Sequelize
const { iLike, not } = Op

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  
  const transaction = await database.transaction()
  
  try {
    const response = await domainVehicle.create({ ...req.body, userId, companyId }, { transaction })
    
    res.json(response)
    await transaction.commit()
  } catch (error) {

    res.status(400).json({ error: error.message })
    await transaction.rollback()
  }
}

const update = async (req, res, next) => {
  
  const transaction = await database.transaction()
  
  try {
    const response = await domainVehicle.update(req.params.id, req.body, { transaction })

    res.json(response)
    await transaction.commit()
  } catch (error) {
    res.status(400).json({ error })
    await transaction.rollback()
  }
}

const getById = async (req, res, next) => {
  try {

    const response = await domainVehicle.getById(req.params.id)

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const companyGroupId = pathOr(null, ['decoded', 'user', 'companyGroupId'], req)

  try {
    const response = await domainVehicle.getAll({...req.query, companyGroupId})

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAllGeolocation =async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const rows = await VehicleModel.findAll({
      where: { companyId, serialNumber: { [not]: null } },
      attributes: ['plate', 'id'],
      include: {
        model: TrackModel,
        limit: 1,
        order: [['createdAt', 'DESC']]
      },
      })
    res.json({ rows })
  } catch (error) {
    res.status(400).json({ error })
  }
}


module.exports = {
  create,
  update,
  getById,
  getAll,
  getAllGeolocation
}

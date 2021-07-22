const { pathOr } = require('ramda')
const database = require('../../database')
const VehicleModel = database.model('vehicle')
const VehicleTypeModel = database.model('vehicleType')

const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await VehicleModel.create({...req.body, userId, companyId }, { include: [VehicleTypeModel] })
    res.json(response)
  } catch (error) {
    
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const findUser = await VehicleModel.findByPk(req.params.id, { include: [VehicleTypeModel] })
    await findUser.update(req.body)
    const response = await findUser.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await VehicleModel.findByPk(req.params.id, { include: [VehicleTypeModel] })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const plate = pathOr(null, ['query', 'plate'], req)
  const fleet = pathOr(null, ['query', 'fleet'], req)
  const isPlate = plate ? { plate: { [iLike]: '%' + plate + '%' } } : null
  const isFleet = fleet ? { fleet: { [iLike]: '%' + fleet + '%' } } : null
  let where = {}
  
  if (isPlate) {
    where = isPlate
  }

  if (isFleet) {
    where = isFleet
  }

  try {
    const count = await VehicleModel.count({ where })
    const response = await VehicleModel.findAndCountAll({ where, include: [VehicleTypeModel], offset: (offset * limit), limit })
    res.json({...response, count })
  } catch (error) {
    res.status(400).json({ error })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
}

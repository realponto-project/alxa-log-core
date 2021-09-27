const { pathOr } = require('ramda')
const database = require('../../database')
const VehicleTypeModel = database.model('vehicleType')

const Sequelize = require('sequelize')
const CompanyModel = database.model('company')

const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  try {
    const response = await VehicleTypeModel.create({...req.body, userId, companyId })
    res.json(response)
  } catch (error) {
    
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const findUser = await VehicleTypeModel.findByPk(req.params.id)
    await findUser.update(req.body)
    const response = await findUser.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await VehicleTypeModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const companyGroupId = pathOr(null, ['decoded', 'user', 'companyGroupId'], req)

  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const name = pathOr(null, ['query', 'name'], req)
  const where = name ? { name: { [iLike]: '%' + name + '%' } } : {}

  try {
    const response = await VehicleTypeModel.findAndCountAll({
      where,
      include: { model: CompanyModel, 
        where: { companyGroupId }
      },
      limit,
      offset: (offset * limit),
    })
    res.json(response)
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

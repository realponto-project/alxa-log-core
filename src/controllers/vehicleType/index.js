const { pathOr } = require('ramda')
const Sequelize = require('sequelize')

const database = require('../../../database')
const domainVehicleType = require('../../Domains/VehicleType')

const {
  Op: { iLike }
} = Sequelize

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()

  try {
    const response = await domainVehicleType.create(
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
    const response = await domainVehicleType.update(req.params.id, req.body)

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await domainVehicleType.getById(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const companyGroupId = pathOr(
    null,
    ['decoded', 'user', 'companyGroupId'],
    req
  )

  try {
    const response = await domainVehicleType.getAll({
      ...req.query,
      companyGroupId
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
  getAll
}

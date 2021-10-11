const { pathOr } = require('ramda')

const database = require('../../../database')
const domainOperation = require('../../Domains/Operation')

const OperationModel = database.model('operation')
const CompanyModel = database.model('company')
const MaintenanceOrderModel = database.model('maintenanceOrder')

const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const transaction = await database.transaction()

  try {
    const response = await domainOperation.create({ ...req.body, userId })

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
    const response = await domainOperation.update(req.params.id, req.body)

    res.json(response)
    await transaction.commit()
  } catch (error) {
    res.status(400).json({ error })
    await transaction.rollback()
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await domainOperation.getById(req.params.id)
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
    const response = await domainOperation.getAll({
      ...req.query,
      companyGroupId
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getSummaryOperations = async (req, res, next) => {
  const operationId = pathOr(null, ['params', 'id'], req)
  try {
    const response = await MaintenanceOrderModel.findAll({
      where: { operationId },
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
      ],
      group: ['status']
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
  getSummaryOperations
}

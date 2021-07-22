const database = require('../../database')
const CompanyModel = database.model('company')
const MaintenanceOrderModel = database.model('maintenanceOrder')
const { pathOr } = require('ramda')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const getAll = async (req, res, next) => {
  const limit = pathOr(20, ['query', 'limit'], req)
  const offset = pathOr(0, ['query', 'offset'], req)
  const document = pathOr(null, ['query', 'document'], req)
  const name = pathOr(null, ['query', 'name'], req)
  const isDocument = document ? { document } : null
  const isName = name ? { name: { [iLike]: '%' + name + '%' } } : null
  let where = {}
  
  if (isDocument) {
    where = isDocument
  }

  if (isName) {
    where = isName
  }

  try {
    const response = await CompanyModel.findAndCountAll({ where, limit, offset: (offset * limit) })
    res.json(response)
  } catch (error) {
    res.status(404).json(error)
  }
}

const createCompany = async (req, res, next) => {
  try {
    const response = await CompanyModel.create(req.body)
    res.json(response)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await CompanyModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(404).json(error)
  }
}

const update = async (req, res, next) => {
  try {
    const response = await CompanyModel.findByPk(req.params.id)
    await response.update(req.body)
    await response.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getSummaryOrders = async (req, res, next) => {
  const companyId = pathOr(null, ['params', 'id'], req)

  try {
    const response = await MaintenanceOrderModel.findAll({ 
      where: { companyId },
      attributes: [
        'status',
        [
          Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')),
          'name'
        ],
        [Sequelize.fn('COUNT', Sequelize.col('createdAt')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('createdAt')),
        'status'
      ],
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAll,
  getById,
  createCompany,
  update,
  getSummaryOrders
}

const Sequelize = require('sequelize')
const { pathOr } = require('ramda')

const database = require('../../database')
const domainCompany = require('../../src/Damains/Company');

const CompanyModel = database.model('company')
const MaintenanceOrderModel = database.model('maintenanceOrder')

const { Op: { iLike } } = Sequelize

const getAll = async (req, res, next) => {
  const companyGroupId = pathOr(null, ['decoded', 'user', 'companyGroupId'], req)

  try {
    const response = await domainCompany.getAll({ ...req.query, companyGroupId })
    
    res.json(response)
  } catch (error) {
    res.status(404).json(error)
  }
}

const createCompany = async (req, res, next) => {
  const companyGroupId = pathOr(null, ['decoded', 'user', 'companyGroupId'], req)
  
  try {
    const response = await CompanyModel.create({ 
      ...req.body,
      companyGroupId
     })
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
        [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
      ],
      group: [
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

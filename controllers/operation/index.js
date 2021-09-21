const { pathOr } = require('ramda')
const database = require('../../database')
const OperationModel = database.model('operation')
const CompanyModel = database.model('company')
const MaintenanceOrderModel = database.model('maintenanceOrder')

const Sequelize = require('sequelize')
const { Op } = Sequelize
const { iLike } = Op

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)

  try {
    const findOperation = await OperationModel.findOne({ where: { name: req.body.name, companyId: req.body.companyId }})
    if (findOperation) {
      throw new Error('Allow only one operation with this name for company!')
    }
    const response = await OperationModel.create({...req.body, userId }, { include: [CompanyModel] })
    res.json(response)
  } catch (error) {
    
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const findUser = await OperationModel.findByPk(req.params.id, { include: [CompanyModel] })
    await findUser.update(req.body)
    const response = await findUser.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await OperationModel.findByPk(req.params.id, { include: [CompanyModel] })
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
    
    const response = await OperationModel.findAndCountAll({
      where,
      include: { model: CompanyModel, where: { companyGroupId } },
      limit,
      offset: (offset * limit)
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
  create,
  update,
  getById,
  getAll,
  getSummaryOperations,
}

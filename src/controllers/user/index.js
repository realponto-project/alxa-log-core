const { hash, compare } = require('bcrypt')
const { omit, pathOr, assoc } = require('ramda')
const Sequelize = require('sequelize')

const database = require('../../database')
const domainUser = require('../../src/Domains/User')

const UserModel = database.model('user')
const CompanyModel = database.model('company')

const { Op: { iLike } } = Sequelize

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

  const transaction =  await database.transaction()

  try {
    const response = await domainUser.create({ companyId, ...req.body })
    
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await domainUser.getById(req.params.id)

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  const companyGroupId = pathOr(null, ['decoded', 'user', 'companyGroupId'], req)
  
  try {
    const response = await domainUser.getAll({ ...req.query, companyGroupId })

    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const update = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const payload = assoc('companyId', companyId, omit(['password'], req.body)) 
  const transaction =  await database.transaction()

  try {
    const response = await domainUser.update(req.params.id, payload, { transaction })

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error })
  }
}

const updatePassword = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction =  await database.transaction()

  try {
    const response = await domainUser.updatePassword(userId, { ...req.body, companyId }, { transaction })

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
  updatePassword,
}

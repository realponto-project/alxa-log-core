const { pathOr } = require('ramda')

const database = require('../../../database')
const domainDriverIncident = require('../../Domains/DriverIncident')

const create = async (req, res, next) => {
  const userId = pathOr(null, ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()

  try {
    const response = await domainDriverIncident.create(
      {
        ...req.body,
        userId,
        companyId
      },
      { transaction }
    )

    res.json(response)
    await transaction.commit()
  } catch (error) {
    res.status(400).json({ error: error.message })
    await transaction.rollback()
  }
}

const update = async (req, res, next) => {
  const incidentId = pathOr(null, ['params', 'id'], req)
  const payload = pathOr(null, ['body'], req)
  const transaction = await database.transaction()

  try {
    const response = await domainDriverIncident.update(incidentId, payload, {
      transaction
    })

    res.json(response)
    await transaction.commit()
  } catch (error) {
    res.status(400).json({ error: error.message })
    await transaction.rollback()
  }
}

const getAll = async (req, res, next) => {
  const driverId = pathOr([], ['params', 'id'], req)

  try {
    const incidents = await domainDriverIncident.getAll({
      ...req.query,
      driverId
    })

    res.json(incidents)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getAll
}

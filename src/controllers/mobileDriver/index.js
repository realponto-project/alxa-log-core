const database = require('../../../database')

const DriverModel = database.model('driver')

const update = async (req, res, next) => {
  try {
    const driver = await DriverModel.findByPk(req.params.id)

    if (!driver) throw new Error('Driver not found')

    await driver.update(req.body)
    const response = await driver.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

module.exports = {
  update
}

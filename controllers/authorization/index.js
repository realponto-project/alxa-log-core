const database = require('../../database')

const AuthorizationModel = database.model('authorization')
const DriverModel = database.model('driver')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  try{
    const response = await AuthorizationModel.create(req.body)

    await transaction.commit()
    res.json(response)
  }catch(error){
    await transaction.rollback()
    res.status(404).json({ error })
  }
}

const update = async (req, res, next) => {
  try {
    const findAuthorization = await AuthorizationModel.findByPk(req.params.id, { include: [] })
    await findAuthorization.update(req.body)
    const response = await findAuthorization.reload()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const getAll = async (req, res, next) => {
  try{
    const response = await AuthorizationModel.findAndCountAll()

    res.json(response)
  }catch(error){
    res.status(404).json({ error })
  }
}

const getAllByDriverId = async (req, res, next) => {
  const { driverId, plate } = req.query

  try{
    if(!driverId) throw new Error('driverId is required')
    if(!plate) throw new Error('plate is required')

    const response = await AuthorizationModel.findAll({
      where: { driverId },
      include: [
        OperationModel,
        {
          model: VehicleModel, 
          where: { plate }
        }
      ]
    })

    res.json(response)
  }catch(error){
    res.status(404).json({ error })
  }
}

const getById = async (req, res, next) => {
  try{
    const response = await AuthorizationModel.findByPk(
      req.params.id,
      {
        include: [
          DriverModel,
          OperationModel,
          VehicleModel
        ]
      }
    )

    res.json(response)
  }catch(error){
    res.status(404).json({ error })
  }
}


module.exports = {
  create,
  getAll,
  getById,
  getAllByDriverId,
  update
};

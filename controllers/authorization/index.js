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

const getAll = async (req, res, next) => {
  try{
    const response = await AuthorizationModel.findAndCountAll()

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
  getById
};

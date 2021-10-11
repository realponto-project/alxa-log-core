const database = require('../../database')
const domainAuthorization = require('../../src/Domains/Authorization')

const AuthorizationModel = database.model('authorization')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  try{
    const response = await domainAuthorization.create(req.body, { transaction })

    await transaction.commit()
    res.json(response)
  }catch(error){
    await transaction.rollback()
    res.status(404).json({ error })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()

  try {
    const response = await domainAuthorization.update(req.params.id, req.body)
    
    res.json(response)
    await transaction.commit()
  } catch (error) {
    res.status(400).json({ error })
    await transaction.rollback()
  }
}


const getById = async (req, res, next) => {
  try{
    const response = await domainAuthorization.getById(req.params.id)

    res.json(response)
  }catch(error){
    res.status(404).json({ error })
  }
}


const getAll = async (req, res, next) => {
  try{
    const response = await domainAuthorization.getAll(req.query)
  
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
      where: { activated: true, driverId },
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


module.exports = {
  create,
  update,
  getById,
  getAll,
  getAllByDriverId,
};

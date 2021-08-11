const { pipe, pathOr, multiply } = require('ramda')
const Sequelize = require('sequelize')
const database = require('../../database')

const AuthorizationModel = database.model('authorization')
const DriverModel = database.model('driver')
const OperationModel = database.model('operation')
const VehicleModel = database.model('vehicle')

const { Op } = Sequelize
const { or, iLike, eq, and, gte, lte } = Op

const buildQueryVehicle = ({ plate }) => {
  let where = {}

  if(plate) {
    where = {
      ...where,
      [or]: [
        { plate: {
          [iLike]: '%' + plate + '%'
        } }
      ],
    }
  }

  return where
}

const buildQueryAuthorization = ({ operationId, activated,  driverId }) => {
  let where = {}

  if(driverId) {
    where = { 
      ...where,
      driverId
    }
  }
    
  if(operationId) {
    where = { 
      ...where,
      operationId
    }
  }
    
  if (activated.length > 0) {
    where = {
      ...where,
      activated: { [or]: activated }
    }
  }

  return where
}


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
  const limit = pipe(pathOr('20', ['query', 'limit']), Number)(req)
  const offset = pipe(pathOr('0', ['query', 'offset']), Number, multiply(limit))(req)
  const driverId = pathOr(null, ['query', 'driverId'], req)
  const operationId = pathOr(null, ['query', 'operationId'], req)
  const plate = pathOr(null, ['query', 'plate'], req)
  const activated =  pathOr([], ['query', 'activated'], req)
  
  const whereAuthorization = buildQueryAuthorization({ activated, driverId, operationId })
  const whereVehicle = buildQueryVehicle({ plate })
  
  console.log('i am here', whereAuthorization)
  
  try{
    const response = await AuthorizationModel.findAndCountAll({
      where: whereAuthorization,
      include: [
        {model: VehicleModel, where: whereVehicle },
        OperationModel
      ],
      limit,
      offset
    })

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

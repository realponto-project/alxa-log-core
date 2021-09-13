const Sequelize = require('sequelize')
const { pathOr } = require('ramda')

const database = require('../../database')
const TrackModel = database.model('track')
const VehicleModel = database.model('vehicle')

const TrackModelStg = require('../../database/models/track.model')
const VehicleModelStg = require('../../database/models/vehicle.model')

const configStgDb = {
  use_env_variable: "DATABASE_URL_STG",
    dialect: "postgres",
    protocol: "postgres",
    url: process.env.DATABASE_URL_STG,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    timezone: process.env.TZ || "America/Sao_Paulo",
}


const saveTrackStg = process.env.SAVE_TRACK_STG

const createTrack = async (req, res, next) => {
  const serialNumber = pathOr(null, ['body', 'serialNumber'], req)
  const payload = pathOr({}, ['body'], req)
  
  if(saveTrackStg){
    const dbStg = new Sequelize(
      `${process.env[configStgDb.use_env_variable]}?sslmode=require`,
      configStgDb
      )
    const trackModelStg = TrackModelStg(dbStg)
    const vehicleModelStg = VehicleModelStg(dbStg)

    const findVehicleStg = await vehicleModelStg.findOne({ where: { serialNumber }})
    if(findVehicleStg){
      await trackModelStg.create({...payload, vehicleId: findVehicleStg.id })
    }
  }


  try {
    const findVehicle = await VehicleModel.findOne({ where: { serialNumber }})
  
    if(payload.gpsLatitude && payload.gpsLongitude){
      if (findVehicle && findVehicle.id) {
        await TrackModel.create({...payload, vehicleId: findVehicle.id })
      }
    }
    
    res.status(200).json({})
  } catch (error) {
    res.status(400).json({ error: 'cannot create track!' })
  }
}

module.exports = {
  createTrack,
}

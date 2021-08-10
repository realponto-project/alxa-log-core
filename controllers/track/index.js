const { pathOr } = require('ramda')
const database = require('../../database')
const TrackModel = database.model('track')
const VehicleModel = database.model('vehicle')

const createTrack = async (req, res, next) => {
  const serialNumber = pathOr(null, ['body', 'serialNumber'], req)
  const payload = pathOr({}, ['body'], req)
  try {
    const findVehicle = await VehicleModel.findOne({ where: { serialNumber }})
  
    if(payload.gpsLatitude && payload.gpsLongitude !== 0){
      if (findVehicle && findVehicle.id) {
        await TrackModel.create({...payload, vehicleId: findVehicle.id })
      }
      res.status(200).json({})
    }
    
  } catch (error) {
    res.status(400).json({ error: 'cannot create track!' })
  }
}

module.exports = {
  createTrack,
}

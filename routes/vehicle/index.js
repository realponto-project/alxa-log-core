const router = require('express').Router()
const { vehicleController } = require('../../controllers')

router.post('/vehicles', vehicleController.create)
router.get('/vehicles', vehicleController.getAll)
router.put('/vehicles/:id', vehicleController.update)
router.get('/vehicles/:id', vehicleController.getById)

module.exports = router

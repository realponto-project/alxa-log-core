const router = require('express').Router()
const { vehicleTypeController } = require('../../src/controllers')

router.post('/vehicle-types', vehicleTypeController.create)
router.get('/vehicle-types', vehicleTypeController.getAll)
router.put('/vehicle-types/:id', vehicleTypeController.update)
router.get('/vehicle-types/:id', vehicleTypeController.getById)

module.exports = router

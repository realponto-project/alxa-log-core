const router = require('express').Router()
const { driverController, mobileDriverController, authorizationController } = require('../../src/controllers')

router.put('/drivers/:id', mobileDriverController.update)
router.get('/drivers/:id', driverController.getById)

router.get('/authorization', authorizationController.getAllByDriverId)

module.exports = router

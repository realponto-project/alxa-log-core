const router = require('express').Router()
const { mobileDriverController, authorizationController } = require('../../controllers')

router.put('/drivers/:id', mobileDriverController.update)

router.get('/authorization', authorizationController.getAllByDriverId)

module.exports = router

const router = require('express').Router()
const { mobileDriverController } = require('../../controllers')

router.put('/:id', mobileDriverController.update)

module.exports = router

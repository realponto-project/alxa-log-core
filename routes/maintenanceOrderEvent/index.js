const router = require('express').Router()
const { maintenanceOrderController } = require('../../controllers')

router.get('/maintenance-order-events', maintenanceOrderController.getByPlate)
router.put('/maintenance-order-events/:id', maintenanceOrderController.createEventToMaintenanceOrder)

module.exports = router

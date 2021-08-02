const router = require('express').Router()
const { maintenanceOrderController } = require('../../controllers')

router.post('/maintenance-orders', maintenanceOrderController.create)
router.get('/maintenance-orders-company', maintenanceOrderController.getAllCompanyId)
router.get('/maintenance-orders-operation', maintenanceOrderController.getAllOperationId)


router.post('/associate-maintenance-orders', maintenanceOrderController.associateDriver)
router.put('/associate-maintenance-orders', maintenanceOrderController.updateAssociateDriver)
router.get('/maintenance-orders', maintenanceOrderController.getAll)
router.put('/maintenance-orders/:id', maintenanceOrderController.update)
router.get('/maintenance-orders/:id', maintenanceOrderController.getById)
router.get('/maintenance-orders-summary-status', maintenanceOrderController.getSummaryOrderByStatus)
router.get('/maintenance-orders-summary-company', maintenanceOrderController.getSummaryOrderByCompany)
router.get('/maintenance-orders-summary-operation', maintenanceOrderController.getSummaryOrderByOperation)

module.exports = router

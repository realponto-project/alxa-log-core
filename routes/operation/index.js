const router = require('express').Router()
const { operationController } = require('../../src/controllers')

router.post('/operations', operationController.create)
router.get('/operations', operationController.getAll)
router.put('/operations/:id', operationController.update)
router.get('/operations/:id', operationController.getById)
router.get('/operations-summary-orders/:id', operationController.getSummaryOperations)

module.exports = router

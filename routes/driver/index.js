const router = require('express').Router()
const { driverController, driverIncidentController } = require('../../src/controllers')

router.post('/drivers', driverController.create)
router.get('/drivers', driverController.getAll)
router.get('/drivers/:id', driverController.getById)
router.put('/drivers/:id', driverController.update)

router.post('/drivers-incidents', driverIncidentController.create)
router.put('/drivers-incidents/:id', driverIncidentController.update)
router.get('/drivers-incidents/:id', driverIncidentController.getAll)

router.get('/drivers-summary-expire', driverController.getSummaryExpire)
router.get('/drivers-incidents-summary/:id', driverController.getIncidentsSummary)


module.exports = router

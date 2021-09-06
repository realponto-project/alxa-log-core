const router = require('express').Router()
const { driverController } = require('../../controllers')

router.post('/drivers', driverController.create)
router.post('/drivers-incidents', driverController.createIncident)
router.put('/drivers-incidents/:id', driverController.updateIncident)

router.get('/drivers-summary-expire', driverController.getSummaryExpire)

router.get('/drivers-incidents-summary/:id', driverController.getIncidentsSummary)
router.get('/drivers-incidents/:id', driverController.getAllIncidentByDriverId)

router.get('/drivers', driverController.getAll)
router.put('/drivers/:id', driverController.update)
router.get('/drivers/:id', driverController.getById)

module.exports = router

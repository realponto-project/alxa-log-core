const router = require('express').Router()
const { companyController } = require('../../controllers')

router.get('/companies', companyController.getAll)
router.get('/companies/:id', companyController.getById)
router.put('/companies/:id', companyController.update)
router.post('/companies', companyController.createCompany)
router.get('/companies-summary-orders/:id', companyController.getSummaryOrders)

module.exports = router
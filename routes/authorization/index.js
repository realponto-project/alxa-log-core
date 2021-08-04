const router = require('express').Router()
const { authorizationController  } = require('../../controllers')

router.post('/authorizations', authorizationController.create)
router.get('/authorizations', authorizationController.getAll)
router.get('/authorizations/:id', authorizationController.getById)


module.exports = router

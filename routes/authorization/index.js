const router = require('express').Router()
const { authorizationController  } = require('../../controllers')

router.post('/authorizations', authorizationController.create)
router.put('/authorizations/:id', authorizationController.update)
router.get('/authorizations/:id', authorizationController.getById)
router.get('/authorizations', authorizationController.getAll)


module.exports = router

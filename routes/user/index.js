const router = require('express').Router()
const { userController } = require('../../controllers')

router.post('/users', userController.create)
router.get('/users', userController.getAll)
router.put('/users/:id', userController.update)
router.get('/users/:id', userController.getById)
router.put('/users-update-password', userController.updatePassword)
module.exports = router

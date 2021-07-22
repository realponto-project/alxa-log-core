const router = require('express').Router()
const { AuthenticationController } = require('../../controllers')

router.post('/login', AuthenticationController.authentication)

module.exports = router

const router = require('express').Router()
const { AuthenticationController } = require('../../src/controllers')

router.post('/login', AuthenticationController.authentication)

module.exports = router

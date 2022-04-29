const router = require('express').Router()
const { trackController } = require('../../src/controllers')

router.post('/tracks', trackController.createTrack)

module.exports = router
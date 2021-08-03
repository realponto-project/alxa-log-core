const router = require('express').Router()
const { trackController } = require('../../controllers')

router.post('/tracks', trackController.createTrack)

module.exports = router
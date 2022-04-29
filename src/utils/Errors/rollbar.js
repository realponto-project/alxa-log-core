const Rollbar = require('rollbar')

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_EN || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true
})

module.exports = rollbar

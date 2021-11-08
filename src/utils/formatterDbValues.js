const { pipe } = require('ramda')

const formatterDbValues = pipe(JSON.stringify, JSON.parse)

module.exports = formatterDbValues

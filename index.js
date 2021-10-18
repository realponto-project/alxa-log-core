// require('dotenv').config({  })
require('dotenv').config({ path: '.env.test' })

// const bodyParser = require('body-parser')
const Express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet');

const { logErrorMiddleware, returnError } = require('./src/utils/Errors/errorHandler')
const rollbar = require('./src/utils/Errors/rollbar');
const env = process.env.NODE_EN || 'development'

const app = Express()

const AuthenticationRoutes = require('./routes/authentication')
const { AuthenticationController } = require('./src/controllers')
const { getByIdMobile } = require('./src/controllers/maintenanceOrder')

const authorizationRoutes = require('./routes/authorization')
const companyRoutes = require('./routes/company')
const userRoutes = require('./routes/user')
const operationRoutes = require('./routes/operation')
const vehicleTypeRoutes = require('./routes/vehicleType')
const vehicleRoutes = require('./routes/vehicle')
const driverRoutes = require('./routes/driver')
const mobileRoutes = require('./routes/mobile')
const maintenanceOrderRoutes = require('./routes/maintenanceOrder')
const maintenanceOrderEventRoutes = require('./routes/maintenanceOrderEvent')
const trackRoutes = require('./routes/track')

const baseUrl = '/api'

app.use(cors())
app.use(helmet());
app.use(morgan('dev'))
app.use(Express.json({ type: 'application/json' }))
app.use(Express.urlencoded({ extended: true }))

// bodyParser is deprecated
// app.use(bodyParser.text())
// app.use(bodyParser.json())
// app.use(bodyParser.json({ type: 'application/json' }))
// app.use(bodyParser.urlencoded({ extended: true }))

app.use('/qrcode-detail/:id', getByIdMobile)
app.use(trackRoutes)
app.use('/auth', AuthenticationRoutes)
app.use('/mobile', mobileRoutes)
app.use(baseUrl, AuthenticationController.checkToken)
app.use(baseUrl, authorizationRoutes)
app.use(baseUrl, companyRoutes)
app.use(baseUrl, userRoutes)
app.use(baseUrl, operationRoutes)
app.use(baseUrl, vehicleTypeRoutes)
app.use(baseUrl, vehicleRoutes)
app.use(baseUrl, driverRoutes)
app.use(baseUrl, maintenanceOrderRoutes)
app.use(baseUrl, maintenanceOrderEventRoutes)

if(env === 'production') app.use(rollbar.errorHandler());

app.use(logErrorMiddleware)
app.use(returnError)

module.exports = app

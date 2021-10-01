require('dotenv').config({ path: '.env.test' })
const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = Express()

const AuthenticationRoutes = require('./routes/authentication')
const { AuthenticationController } = require('./controllers')
const { getByIdMobile } = require('./controllers/maintenanceOrder')

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

app.use(morgan('dev'))
app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: true }))

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

module.exports = app

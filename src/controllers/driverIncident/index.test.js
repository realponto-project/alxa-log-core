const request = require('supertest')

require('../../utils/jest/extends')
const app = require('../../../')
const globalMock = require('../../utils/Mocks/global')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')

describe('controller driver incident', () => {
  let token = null
  let vehicleFactory = null
  let operationFactory = null
  let driverFactory = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    vehicleFactory = await factory.create('vehicle')
    operationFactory = await factory.create('operation')
    driverFactory = await factory.create('driver')

    token = body.token
  })

  describe('post', () => {
    it('should be able crate new driver incident', async () => {
      expect.assertions(2)

      const payload = faker.driverIncidentFaker({
        vehicleId: vehicleFactory.id,
        operationId: operationFactory.id,
        driverId: driverFactory.id
      })

      const response = await request(app)
        .post('/api/drivers-incidents')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body')
    })
  })

  describe('put', () => {
    let driverIncidentFactory = null

    beforeAll(async () => {
      driverIncidentFactory = await factory.create('driverIncident')
    })

    it('should be able update a driver incident', async () => {
      expect.assertions(2)

      const payload = faker.driverIncidentFaker({
        vehicleId: vehicleFactory.id,
        operationId: operationFactory.id,
        driverId: driverFactory.id
      })

      const response = await request(app)
        .put(`/api/drivers-incidents/${driverIncidentFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          incidentDate: expect.toBeDate(),
          incidentType: payload.incidentType,
          incidentDescription: payload.incidentDescription,
          vehicleId: payload.vehicleId,
          operationId: payload.operationId,
          driverId: payload.driverId
        })
      )
    })
  })

  describe('get', () => {
    let driverIncidentsFactory = null

    beforeAll(async () => {
      driverIncidentsFactory = await factory.createMany('driverIncident', 2)
    })
    it('should be able get driver incidents by driver id', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get(`/api/drivers-incidents/${driverIncidentsFactory[0].driverId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          count: expect.any(Number),
          rows: expect.any(Array)
        })
      )
    })
  })
})

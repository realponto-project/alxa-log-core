const request = require('supertest')

require('../../utils/jest/extends')
const app = require('../../../')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller maintenance order', () => {
  let token = null
  let operationFactory = null
  let driverFactory = null

  beforeAll(async () => {
    operationFactory = await factory.create('operation')
    driverFactory = await factory.create('driver')

    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    token = body.token
  })

  describe('post', () => {
    it('should ba able create a new maintenance order', async () => {
      expect.assertions(2)

      const payload = faker.maintenanceOrderFaker({
        companyId: globalMock.company.id,
        userId: globalMock.user.id,
        operationId: operationFactory.id,
        driverId: driverFactory.id
      })

      const response = await request(app)
        .post('/api/maintenance-orders')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          maintenanceDate: expect.toBeDate(),
          fleet: expect.any(String),
          companyId: payload.companyId,
          userId: payload.userId,
          operationId: payload.operationId,
          service: payload.service,
          priority: payload.priority,
          status: payload.status,
          costCenter: payload.costCenter,
          serviceDescription: payload.serviceDescription,
          plateHorse: payload.plateHorse,
          plateCart: payload.plateCart
        })
      )
    })
  })

  describe('put', () => {
    let maintenanceOrderFactory = null

    beforeAll(async () => {
      maintenanceOrderFactory = await factory.create('maintenanceOrder', {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able update a maintenance order', async () => {
      expect.assertions(2)

      const payload = faker.maintenanceOrderFaker()

      const response = await request(app)
        .put(`/api/maintenance-orders/${maintenanceOrderFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          maintenanceDate: expect.toBeDate(),
          fleet: expect.any(String),
          service: payload.service,
          priority: payload.priority,
          status: payload.status,
          costCenter: payload.costCenter,
          serviceDescription: payload.serviceDescription,
          plateHorse: payload.plateHorse,
          plateCart: payload.plateCart
        })
      )
    })
  })

  describe('get', () => {
    let maintenanceOrdersFactory = null

    beforeAll(async () => {
      maintenanceOrdersFactory = await factory.createMany(
        'maintenanceOrder',
        2,
        {
          companyId: globalMock.company.id
        }
      )
    })

    it('should be able get maintenance orders', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get(`/api/maintenance-orders`)
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

    it('should be able get a maintenance order by id', async () => {
      expect.assertions(2)

      const payload = maintenanceOrdersFactory[0]

      const response = await request(app)
        .get(`/api/maintenance-orders/${payload.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          ...formatterDbValues(payload)
        })
      )
    })
  })
})

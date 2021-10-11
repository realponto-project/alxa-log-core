const request = require('supertest')

require('../../utils/jest/extends')
const app = require('../../../')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller driver', () => {
  let token = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    token = body.token
  })

  describe('post', () => {
    it('should be able create new driver', async () => {
      expect.assertions(2)

      const payload = faker.driverFaker({
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body')
    })
  })

  describe('put', () => {
    let driverFactory = null

    beforeAll(async () => {
      driverFactory = await factory.create('driver')
    })

    it('should be able update a driver', async () => {
      expect.assertions(2)

      const payload = faker.driverFaker()

      const response = await request(app)
        .put(`/api/drivers/${driverFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          name: payload.name,
          phone: payload.phone,
          driverLicense: payload.driverLicense,
          expireASO: expect.toBeDate(),
          expireDriverLicense: expect.toBeDate(),
          expireProtocolInsuranceCompany: expect.toBeDate()
        })
      )
    })
  })

  describe('get', () => {
    let driversFactory = null

    beforeAll(async () => {
      driversFactory = await factory.createMany('driver', 2, {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })
    it('should be able get drivers', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get('/api/drivers')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send()

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          count: expect.any(Number),
          rows: expect.any(Array)
        })
      )
    })

    it('should be able get a driver by id', async () => {
      expect.assertions(2)

      const payload = driversFactory[0]

      const response = await request(app)
        .get(`/api/drivers/${payload.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining(formatterDbValues(payload))
      )
    })
  })
})

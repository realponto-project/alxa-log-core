const request = require('supertest')

const app = require('../../../')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller vehicle type', () => {
  let token = null
  let vehicleTypeFactory = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })
    vehicleTypeFactory = await factory.create('vehicleType', {
      companyId: globalMock.company.id
    })

    token = body.token
  })

  describe('post', () => {
    it('should ba able create a new vehicle', async () => {
      expect.assertions(2)

      const payload = faker.vehicleFaker({
        vehicleTypeId: vehicleTypeFactory.id
      })

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('put', () => {
    let vehicleFactory = null

    beforeAll(async () => {
      vehicleFactory = await factory.create('vehicle', {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able update a vehicle', async () => {
      expect.assertions(2)

      const payload = faker.vehicleFaker()

      const response = await request(app)
        .put(`/api/vehicles/${vehicleFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('get', () => {
    let vehiclesFactory = null

    beforeAll(async () => {
      vehiclesFactory = await factory.createMany('vehicle', 2, {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able get vehicle', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get(`/api/vehicles`)
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

    it('should be able get a vehicle by id', async () => {
      expect.assertions(2)

      const payload = vehiclesFactory[0]

      const response = await request(app)
        .get(`/api/vehicles/${payload.id}`)
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

const request = require('supertest')

const app = require('../../../')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller vehicle type', () => {
  let token = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    token = body.token
  })

  describe('post', () => {
    it('should ba able create a new vehicle type', async () => {
      expect.assertions(2)

      const payload = faker.vehicleTypeFaker()

      const response = await request(app)
        .post('/api/vehicle-types')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('put', () => {
    let vehicleTypeFactory = null

    beforeAll(async () => {
      vehicleTypeFactory = await factory.create('vehicleType', {
        companyId: globalMock.company.id
      })
    })

    it('should be able update a vehicle type', async () => {
      expect.assertions(2)

      const payload = faker.vehicleTypeFaker()

      const response = await request(app)
        .put(`/api/vehicle-types/${vehicleTypeFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('get', () => {
    let vehicleTypesFactory = null

    beforeAll(async () => {
      vehicleTypesFactory = await factory.createMany('vehicleType', 2, {
        companyId: globalMock.company.id
      })
    })

    it('should be able get vehicle types', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get(`/api/vehicle-types`)
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

    it('should be able get a vehicle type by id', async () => {
      expect.assertions(2)

      const payload = vehicleTypesFactory[0]

      const response = await request(app)
        .get(`/api/vehicle-types/${payload.id}`)
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

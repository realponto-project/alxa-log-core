const request = require('supertest')

require('../../utils/jest/extends')
const app = require('../../../')
const globalMock = require('../../utils/Mocks/global')
const factory = require('../../utils/Mocks/factories')
const { mergeAll } = require('ramda')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller authorization', () => {
  let token = null
  let driverFactory = null
  let operationFactory = null
  let vehicleFactory = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    driverFactory = await factory.create('driver')
    operationFactory = await factory.create('operation')
    vehicleFactory = await factory.create('vehicle')

    token = body.token
  })

  describe('post', () => {
    it('should be able create new authorization', async () => {
      expect.assertions(2)

      const payload = {
        driverId: driverFactory.id,
        operationId: operationFactory.id,
        vehicleId: vehicleFactory.id
      }

      const response = await request(app)
        .post('/api/authorizations')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('put', () => {
    let authorizationFactory = null

    beforeAll(async () => {
      authorizationFactory = await factory.create('authorization')
    })
    it('should be able update a authorization', async () => {
      expect.assertions(2)

      const payload = {
        operationId: operationFactory.id
      }

      const response = await request(app)
        .put(`/api/authorizations/${authorizationFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining(
          mergeAll([
            formatterDbValues(authorizationFactory),
            payload,
            { updatedAt: expect.toBeDate() }
          ])
        )
      )
    })
  })

  describe('get', () => {
    let authorizationsFactory = null

    beforeAll(async () => {
      authorizationsFactory = await factory.createMany('authorization', 2)
    })

    it('should be able get authorizations', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get('/api/authorizations')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          rows: expect.any(Array),
          count: expect.any(Number)
        })
      )
    })

    it('should be able get authorizations by id', async () => {
      expect.assertions(2)

      const payload = authorizationsFactory[0]

      const response = await request(app)
        .get(`/api/authorizations/${payload.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body')
    })
  })
})

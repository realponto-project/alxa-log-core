const request = require('supertest')

const app = require('../../../')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller operation', () => {
  let token = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    token = body.token
  })

  describe('post', () => {
    it('should ba able create a new operation', async () => {
      expect.assertions(2)

      const payload = faker.operationFaker()

      const response = await request(app)
        .post('/api/operations')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('put', () => {
    let operationFactory = null

    beforeAll(async () => {
      operationFactory = await factory.create('operation', {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able update a operation', async () => {
      expect.assertions(2)

      const payload = faker.vehicleTypeFaker()

      const response = await request(app)
        .put(`/api/operations/${operationFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('get', () => {
    let operationsFactory = null

    beforeAll(async () => {
      operationsFactory = await factory.createMany('operation', 2, {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able get operations', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get(`/api/operations`)
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

    it('should be able get a operation by id', async () => {
      expect.assertions(2)

      const payload = operationsFactory[0]

      const response = await request(app)
        .get(`/api/operations/${payload.id}`)
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

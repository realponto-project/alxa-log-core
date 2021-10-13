const request = require('supertest')

const app = require('../../../')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('controller username', () => {
  let token = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    token = body.token
  })

  describe('post', () => {
    it('should ba able create a new user', async () => {
      expect.assertions(2)

      const payload = faker.userFaker()

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          document: payload.document,
          name: payload.name
        })
      )
    })
  })

  describe('put', () => {
    let userFactory = null

    beforeAll(async () => {
      userFactory = await factory.create('user', {
        companyId: globalMock.company.id
      })
    })

    it('should be able update a user', async () => {
      expect.assertions(2)

      const payload = faker.userFaker()

      const response = await request(app)
        .put(`/api/users/${userFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          document: payload.document,
          name: payload.name
        })
      )
    })
  })

  describe('get', () => {
    let usersFactory = null

    beforeAll(async () => {
      usersFactory = await factory.createMany('user', 2, {
        companyId: globalMock.company.id
      })
    })

    it('should be able get users', async () => {
      expect.assertions(2)

      const payload = faker.userFaker()

      const response = await request(app)
        .get(`/api/users`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({
          count: expect.any(Number),
          rows: expect.any(Array)
        })
      )
    })

    it('should be able get a user by id', async () => {
      expect.assertions(2)

      const payload = usersFactory[0]

      const response = await request(app)
        .get(`/api/users/${payload.id}`)
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

const request = require('supertest')

const app = require('../../../index')
const globalMock = require('../../utils/Mocks/global')

describe('authentication controller', () => {
  describe('login', () => {
    it('should return a token', async () => {
      expect.hasAssertions()

      const response = await request(app).post('/auth/login').send({
        document: globalMock.user.document,
        password: '123456'
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })
  })

  describe('middleware', () => {
    let token = null

    beforeAll(async () => {
      const { body } = await request(app).post('/auth/login').send({
        document: globalMock.user.document,
        password: '123456'
      })

      token = body.token
    })

    it('should be able acess private routes when passed valid token', async () => {
      expect.assertions(1)

      const response = await request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({})

      expect(response).toHaveProperty('status', 200)
    })

    it('should not be able access private routes without token', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get('/api/companies')
        .set('Accept', 'application/json')
        .send({})

      expect(response).toHaveProperty('status', 403)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({ message: 'Auth token is not supplied' })
      )
    })
  })
})

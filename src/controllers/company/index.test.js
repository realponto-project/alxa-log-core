const request = require('supertest')

const app = require('../../../index')
const globalMock = require('../../utils/Mocks/global')
const fackers = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')

describe('company controller', () => {
  let token = null

  beforeAll(async () => {
    const { body } = await request(app).post('/auth/login').send({
      document: globalMock.user.document,
      password: '123456'
    })

    token = body.token
  })

  describe('post', () => {
    it('should be able create new company', async () => {
      expect.assertions(2)

      const payload = fackers.companyFaker()

      const response = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body', expect.objectContaining(payload))
    })
  })

  describe('put', () => {
    let companyFactory = null

    beforeAll(async () => {
      companyFactory = await factory.create('company')
    })

    it('should be able update comapny', async () => {
      expect.assertions(2)

      const payload = fackers.companyFaker()

      const response = await request(app)
        .put(`/api/companies/${companyFactory.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(payload)

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty(
        'body',
        expect.objectContaining({ ...payload, id: companyFactory.id })
      )
    })
  })

  describe('get', () => {
    let companiesFactory = null

    beforeAll(async () => {
      companiesFactory = await factory.createMany('company', 2, {
        companyGroupId: globalMock.companyGroup.id
      })
    })

    it('should be able get companies', async () => {
      expect.assertions(2)

      const response = await request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body')
    })

    it('should be able get company by id', async () => {
      expect.assertions(2)

      const payload = companiesFactory[0]

      const response = await request(app)
        .get(`/api/companies/${payload.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')

      expect(response).toHaveProperty('status', 200)
      expect(response).toHaveProperty('body')
    })
  })
})

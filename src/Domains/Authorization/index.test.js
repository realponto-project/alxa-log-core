require('../../utils/jest/extends')
const domainAuthorization = require('.')
const formatterDbValues = require('../../utils/formatterDbValues')
const factory = require('../../utils/Mocks/factories')

describe('domain', () => {
  let driverFactory = null
  let operationFactory = null
  let vehicleFactory = null

  beforeAll(async () => {
    driverFactory = await factory.create('driver')
    operationFactory = await factory.create('operation')
    vehicleFactory = await factory.create('vehicle')
  })

  describe('create', () => {
    it('should be able create new authorization', async () => {
      expect.assertions(1)

      const authorization = {
        driverId: driverFactory.id,
        operationId: operationFactory.id,
        vehicleId: vehicleFactory.id
      }

      await expect(
        domainAuthorization.create(authorization)
      ).resolves.toStrictEqual(
        expect.objectContaining({
          ...authorization,
          activated: true,
          id: expect.toBeUUID(),
          createdAt: expect.toBeDate(),
          updatedAt: expect.toBeDate()
        })
      )
    })
  })

  describe('update', () => {
    let authorizationFactory = null

    beforeAll(async () => {
      authorizationFactory = await factory.create('authorization')
    })
    it('should be able update a authorization', async () => {
      expect.assertions(1)

      const authorizationMock = { activated: false }

      await expect(
        domainAuthorization.update(authorizationFactory.id, authorizationMock)
      ).resolves.toStrictEqual(
        expect.objectContaining({
          ...authorizationMock
        })
      )
    })
  })

  describe('get', () => {
    let authorizationsFactory = null

    beforeAll(async () => {
      authorizationsFactory = await factory.createMany('authorization', 2)
    })
    it('should be able get a authorization by id', async () => {
      expect.assertions(1)

      const authorizationFactory = authorizationsFactory[0]

      const authorization = await domainAuthorization.getById(
        authorizationFactory.id
      )

      expect(formatterDbValues(authorization)).toStrictEqual(
        formatterDbValues(authorizationFactory)
      )
    })

    it('should be able get many authorizations', async () => {
      expect.hasAssertions()

      const authorizations = await domainAuthorization.getAll({
        // companyGroupId: globalMock.company.companyGroupId
      })

      expect(authorizations).toHaveProperty('count')
      expect(authorizations.count).toBeGreaterThan(0)
      expect(authorizations).toHaveProperty('rows')
    })
  })
})

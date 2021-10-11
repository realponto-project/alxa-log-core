const domainMaintenanceOrder = require('.')

require('../../utils/jest/extends')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const formatterDbValues = require('../../utils/formatterDbValues')
const globalMock = require('../../utils/Mocks/global')
const { omit } = require('ramda')

describe('domain maintenance order', () => {
  let companyFactory = null
  let userFactory = null
  let operationFactory = null
  let driverFactory = null

  beforeAll(async () => {
    companyFactory = await factory.create('company')
    userFactory = await factory.create('user')
    operationFactory = await factory.create('operation')
    driverFactory = await factory.create('driver')
  })

  describe('create', () => {
    it('should be able create new maintenance order', async () => {
      expect.assertions(1)

      const maintenanceOrderMock = faker.maintenanceOrderFaker({
        companyId: globalMock.company.id,
        userId: userFactory.id,
        operationId: operationFactory.id,
        driverId: driverFactory.id
      })

      await expect(
        domainMaintenanceOrder.create(maintenanceOrderMock)
      ).resolves.toStrictEqual(
        expect.objectContaining(
          omit(['driverId', 'fleet'], maintenanceOrderMock)
        )
      )
    })
  })

  describe('update', () => {
    let maintenanceOrderFactory = null

    beforeAll(async () => {
      maintenanceOrderFactory = await factory.create('maintenanceOrder')
    })
    it('should be able update a maintenance order', async () => {
      expect.assertions(1)

      const maintenanceOrderMock = faker.maintenanceOrderFaker()

      await expect(
        domainMaintenanceOrder.update(
          maintenanceOrderFactory.id,
          maintenanceOrderMock
        )
      ).resolves.toStrictEqual(expect.objectContaining(maintenanceOrderMock))
    })
  })

  describe('get', () => {
    let maintenanceOrdersFactory = null

    beforeAll(async () => {
      maintenanceOrdersFactory = await factory.createMany('maintenanceOrder', 2)
    })

    it('should be able get a maintenance order by id', async () => {
      expect.assertions(1)

      const maintenanceOrderMock = maintenanceOrdersFactory[0]

      const maintenanceOrder = await domainMaintenanceOrder.getById(
        maintenanceOrderMock.id
      )

      expect(formatterDbValues(maintenanceOrder)).toStrictEqual(
        expect.objectContaining(formatterDbValues(maintenanceOrderMock))
      )
    })

    it('should be able get many maintenance orders', async () => {
      expect.hasAssertions()

      const maintenanceOrders = await domainMaintenanceOrder.getAll({
        companyId: globalMock.company.id
      })

      expect(maintenanceOrders).toHaveProperty('count')
      expect(maintenanceOrders.count).toBeGreaterThan(0)
      expect(maintenanceOrders).toHaveProperty('rows')

      maintenanceOrders.rows.forEach((row) => {
        expect(formatterDbValues(row)).toStrictEqual(
          expect.objectContaining({
            id: expect.toBeUUID(),
            companyId: expect.toBeUUID(),
            userId: expect.toBeUUID(),
            operationId: expect.toBeUUID(),
            maintenanceDate: expect.toBeDate(),
            updatedAt: expect.toBeDate(),
            createdAt: expect.toBeDate(),
            activated: expect.any(Boolean),
            plateHorse: expect.any(String),
            plateCart: expect.any(String),
            fleet: expect.any(String),
            costCenter: expect.any(String),
            priority: expect.any(String),
            service: expect.any(String),
            serviceDescription: expect.any(String),
            status: expect.any(String),
            company: expect.objectContaining({
              id: expect.toBeUUID(),
              name: expect.any(String),
              document: expect.stringMatching(/\d/g),
              type: expect.stringMatching(/filial|matriz/),
              zipcode: expect.stringMatching(/\d/g),
              street: expect.any(String),
              streetNumber: expect.any(String),
              neighborhood: expect.any(String),
              city: expect.any(String),
              state: expect.any(String),
              createdAt: expect.toBeDate(),
              updatedAt: expect.toBeDate(),
              companyGroupId: globalMock.company.companyGroupId
            }),
            maintenanceOrderDrivers: expect.any(Array),
            maintenanceOrderEvents: expect.any(Array)
          })
        )
      })
    })
  })
})

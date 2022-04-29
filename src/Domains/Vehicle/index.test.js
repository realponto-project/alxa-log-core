const { ValidationError } = require('sequelize')

require('../../utils/jest/extends')
const domainVehicle = require('.')

const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')
const { UniqueConstraintError } = require('sequelize')

describe('domain Vehicle', () => {
  let companyFactory = null
  let vehicleTypeFactory = null
  let userFactory = null

  beforeAll(async () => {
    companyFactory = await factory.create('company')
    vehicleTypeFactory = await factory.create('vehicleType')
    userFactory = await factory.create('user')
  })
  describe('create', () => {
    it('should be able create new vehicle', async () => {
      expect.assertions(1)

      const vehicleMock = faker.vehicleFaker({
        companyId: companyFactory.id,
        vehicleTypeId: vehicleTypeFactory.id,
        userId: userFactory.id
      })

      await expect(domainVehicle.create(vehicleMock)).resolves.toStrictEqual(
        expect.objectContaining(vehicleMock)
      )
    })
    it('should not be able create new vehicle without vehicle type', async () => {
      expect.assertions(1)

      const vehicleMock = faker.vehicleFaker({
        companyId: companyFactory.id,
        userId: userFactory.id
      })

      await expect(domainVehicle.create(vehicleMock)).rejects.toThrow(
        new ValidationError(
          'notNull Violation: vehicle.vehicleTypeId cannot be null'
        )
      )
    })

    it('should not be able create two vehicle with same plate', async () => {
      expect.assertions(1)

      const vehicleFactory = await factory.create('vehicle')
      const vehiclePayload = formatterDbValues(vehicleFactory)

      await expect(domainVehicle.create(vehiclePayload)).rejects.toThrow(
        new UniqueConstraintError({ message: 'Validation error' })
      )
    })
  })

  describe('update', () => {
    let vehicleFactory = null

    beforeAll(async () => {
      vehicleFactory = await factory.create('vehicle')
    })
    it('should be able update a vehicle', async () => {
      expect.assertions(1)

      const vehicleMock = faker.vehicleFaker()

      await expect(
        domainVehicle.update(vehicleFactory.id, vehicleMock)
      ).resolves.toStrictEqual(expect.objectContaining(vehicleMock))
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

    it('should be able get a vehicle by id', async () => {
      expect.assertions(1)

      const vehicleFactory = vehiclesFactory[0]

      const vehicle = await domainVehicle.getById(vehicleFactory.id)

      expect(formatterDbValues(vehicle)).toStrictEqual({
        ...formatterDbValues(vehicleFactory),
        tracks: expect.any(Array),
        vehicleType: expect.objectContaining({
          id: expect.toBeUUID(),
          name: expect.any(String),
          createdAt: expect.toBeDate(),
          updatedAt: expect.toBeDate(),
          userId: expect.toBeUUID(),
          companyId: expect.toBeUUID()
        })
      })
    })

    it('should be able get many vehicles', async () => {
      expect.hasAssertions()

      const vehicles = await domainVehicle.getAll({
        companyGroupId: globalMock.company.companyGroupId
      })

      expect(vehicles).toHaveProperty('count')
      expect(vehicles.count).toBeGreaterThan(0)
      expect(vehicles).toHaveProperty('rows')
    })
  })
})

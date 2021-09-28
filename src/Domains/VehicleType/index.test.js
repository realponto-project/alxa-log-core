const { UniqueConstraintError } = require('sequelize')

const domainVehicleType = require('.')
const factory = require('../../../utils/Mocks/factories')
const faker = require('../../../utils/Mocks/fakers')
const formatterDbValues = require('../../../utils/formatterDbValues')
const globalMock = require('../../../utils/Mocks/global')

describe('domain vehicle type', () => {
  let userMock = null

  beforeAll(async () => {
    userMock = await factory.create('user')
  })

  describe('create', () => {
    it('should be create new vehicle type', async () => {
      expect.assertions(1)

      const vehicleTypePayload = faker.vehicleTypeFaker({
        userId: userMock.id,
        companyId: userMock.companyId
      })

      await expect(
        domainVehicleType.create(vehicleTypePayload)
      ).resolves.toStrictEqual(expect.objectContaining(vehicleTypePayload))
    })

    it('should not be create two vehicle type with same name', async () => {
      expect.assertions(1)

      const vehicleTypeFactory = await factory.create('vehicleType')
      const vehicleTypePayload = formatterDbValues(vehicleTypeFactory)

      await expect(
        domainVehicleType.create(vehicleTypePayload)
      ).rejects.toThrow(
        new UniqueConstraintError({ message: 'Validation error' })
      )
    })
  })

  describe('update', () => {
    let vehicleTypeFactory = null

    beforeAll(async () => {
      vehicleTypeFactory = await factory.create('vehicleType')
    })

    it('should be able update vehicle types', async () => {
      expect.assertions(1)

      const vehicleTypePayload = faker.vehicleTypeFaker({
        userId: userMock.id,
        companyId: userMock.companyId
      })

      await expect(
        domainVehicleType.update(vehicleTypeFactory.id, vehicleTypePayload)
      ).resolves.toStrictEqual(expect.objectContaining(vehicleTypePayload))
    })

    it('should not be update vehicle type when passed invalid id', async () => {
      expect.assertions(1)

      const vehicleTypePayload = faker.vehicleTypeFaker({
        userId: userMock.id,
        companyId: userMock.companyId
      })

      await expect(
        domainVehicleType.update(null, vehicleTypePayload)
      ).rejects.toThrow(new Error('Vehicle type not found'))
    })
  })

  describe('get', () => {
    let vehicleTypesFactory = []

    beforeAll(async () => {
      vehicleTypesFactory = await factory.createMany('vehicleType', 2, {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able get many vehicle types', async () => {
      expect.assertions(4)

      const vehicleTypes = await domainVehicleType.getAll()

      expect(vehicleTypes).toHaveProperty('count')
      expect(vehicleTypes.count).toBeGreaterThan(0)
      expect(vehicleTypes).toHaveProperty('rows')
      expect(formatterDbValues(vehicleTypes.rows)).toStrictEqual(
        expect.arrayContaining(formatterDbValues(vehicleTypesFactory))
      )
    })

    it('should be able get a vehicle type by id', async () => {
      expect.assertions(1)

      const vehicleTypeFactory = vehicleTypesFactory[0]

      const vehicleType = await domainVehicleType.getById(vehicleTypeFactory.id)

      expect(formatterDbValues(vehicleType)).toStrictEqual(
        formatterDbValues(vehicleTypeFactory)
      )
    })
  })
})

const { omit, pipe } = require('ramda')
const { UniqueConstraintError } = require('sequelize')

require('../../utils/jest/extends')
const globalMock = require('../../utils/Mocks/global')
const domainDriver = require('.')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('domain driver', () => {
  let companyFactory = null
  let userFactory = null

  beforeAll(async () => {
    companyFactory = await factory.create('company')
    userFactory = await factory.create('user')
  })

  describe('create', () => {
    it('should be able create new driver', async () => {
      expect.assertions(1)

      const driverMock = faker.driverFaker({
        companyId: companyFactory.id,
        userId: userFactory.id
      })

      await expect(domainDriver.create(driverMock)).resolves.toStrictEqual(
        expect.objectContaining(driverMock)
      )
    })

    it('should not be able create two driver with same driver license', async () => {
      expect.assertions(1)

      const driverFactory = await factory.create('driver')
      const driverPayload = pipe(formatterDbValues, omit(['id']))(driverFactory)

      await expect(domainDriver.create(driverPayload)).rejects.toThrow(
        new UniqueConstraintError({ message: 'Validation error' })
      )
    })
  })

  describe('update', () => {
    let driverFactory = null

    beforeAll(async () => {
      driverFactory = await factory.create('driver')
    })

    it('should be able update a driver', async () => {
      expect.assertions(1)

      const driverMock = faker.driverFaker({
        companyId: companyFactory.id,
        userId: userFactory.id
      })

      await expect(
        domainDriver.update(driverFactory.id, driverMock)
      ).resolves.toStrictEqual(expect.objectContaining(driverMock))
    })

    it('should not be able update a driver when not passed the id', async () => {
      expect.assertions(1)

      const driverMock = faker.driverFaker({
        companyId: companyFactory.id,
        userId: userFactory.id
      })

      await expect(domainDriver.update(null, driverMock)).rejects.toThrow(
        new Error('Driver not found')
      )
    })
  })

  describe('get', () => {
    let driversFactory = null

    beforeAll(async () => {
      driversFactory = await factory.createMany('driver', 2, {
        companyId: globalMock.company.id
      })
    })

    it('should be able get a driver by id', async () => {
      expect.assertions(1)

      const driverFactory = driversFactory[0]

      const driver = await domainDriver.getById(driverFactory.id)

      expect(formatterDbValues(driver)).toStrictEqual(
        expect.objectContaining(formatterDbValues(driverFactory))
      )
    })
    it('should be able get many drivers', async () => {
      expect.hasAssertions()

      const drivers = await domainDriver.getAll({
        companyGroupId: globalMock.company.companyGroupId
      })

      expect(drivers).toHaveProperty('count')
      expect(drivers).toHaveProperty('countExpireDriverLicense')
      expect(drivers).toHaveProperty('countExpireProtocolInsuranceCompany')
      expect(drivers).toHaveProperty('countExpireASO')
      expect(drivers.count).toBeGreaterThan(0)
      expect(drivers.countExpireDriverLicense).toBeGreaterThan(-1)
      expect(drivers.countExpireProtocolInsuranceCompany).toBeGreaterThan(-1)
      expect(drivers.countExpireASO).toBeGreaterThan(-1)
      expect(drivers).toHaveProperty('rows')

      drivers.rows.forEach((row) => {
        expect(formatterDbValues(row)).toStrictEqual(
          expect.objectContaining({
            id: expect.toBeUUID(),
            companyId: expect.toBeUUID(),
            userId: expect.toBeUUID(),
            name: expect.any(String),
            phone: expect.any(String),
            driverLicense: expect.any(String),
            rg: expect.any(String),
            cpf: expect.any(String),
            activated: expect.any(Boolean),
            authorizationOnboarding: expect.any(Boolean),
            mop: expect.any(Boolean),
            bond: expect.stringMatching(
              /AGREGADO|FROTA|TERCEIRO|TERCEIRO FIDELIZADO/
            ),
            expireDriverLicense: expect.toBeDate(),
            expireASO: expect.toBeDate(),
            createdAt: expect.toBeDate(),
            expireProtocolInsuranceCompany: expect.toBeDate(),
            updatedAt: expect.toBeDate(),
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
            })
          })
        )
      })
    })
  })
})

const { ValidationError } = require('sequelize')

require('../../utils/jest/extends')
const domainOperation = require('.')
const faker = require('../../utils/Mocks/fakers')
const factory = require('../../utils/Mocks/factories')
const globalMock = require('../../utils/Mocks/global')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('domain operation', () => {
  let userFactory = null

  beforeAll(async () => {
    userFactory = await factory.create('user')
  })

  describe('create', () => {
    it('shoul be able create new operation', async () => {
      expect.assertions(1)

      const operationMock = faker.operationFaker({
        companyId: userFactory.companyId,
        userId: userFactory.id
      })

      await expect(
        domainOperation.create(operationMock)
      ).resolves.toStrictEqual(expect.objectContaining(operationMock))
    })

    it('should not be able crata two operations with same companyId and name', async () => {
      expect.assertions(1)

      const operationFactory = await factory.create('operation')

      const operationMock = faker.operationFaker({
        name: operationFactory.name,
        companyId: operationFactory.companyId,
        userId: operationFactory.userId
      })

      await expect(domainOperation.create(operationMock)).rejects.toThrow(
        new ValidationError('Validation error')
      )
    })
  })

  describe('read', () => {
    let operationsFactory = null
    beforeAll(async () => {
      operationsFactory = await factory.createMany('operation', 2, {
        companyId: globalMock.company.id,
        userId: globalMock.user.id
      })
    })

    it('should be able get operation by Id', async () => {
      expect.assertions(1)

      const operationMock = operationsFactory[0]
      const operation = await domainOperation.getById(operationMock.id)

      expect(formatterDbValues(operation)).toStrictEqual({
        ...formatterDbValues(operationMock),
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
    })

    it('should be able get many operations', async () => {
      expect.hasAssertions()

      const operations = await domainOperation.getAll({
        companyGroupId: globalMock.company.companyGroupId
      })

      expect(operations).toHaveProperty('count')
      expect(operations.count).toBeGreaterThan(0)
      expect(operations).toHaveProperty('rows')
      operations.rows.forEach((row) => {
        expect(formatterDbValues(row)).toStrictEqual(
          expect.objectContaining({
            id: expect.toBeUUID(),
            companyId: expect.toBeUUID(),
            userId: expect.toBeUUID(),
            createdAt: expect.toBeDate(),
            updatedAt: expect.toBeDate(),
            name: expect.any(String),
            vacancy: expect.any(Number),
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

  describe('update', () => {
    let operationFactory = null
    beforeAll(async () => {
      operationFactory = await factory.create('operation')
    })

    it('should be able a update operation', async () => {
      expect.assertions(1)

      const operationMock = faker.operationFaker()

      await expect(
        domainOperation.update(operationFactory.id, operationMock)
      ).resolves.toStrictEqual(expect.objectContaining(operationMock))
    })
  })
})

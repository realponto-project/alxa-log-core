const { ValidationError } = require('sequelize')
const { omit } = require('ramda')
const { compare } = require('bcrypt')
// const cnpj = require('@fnando/cnpj/commonjs')
require('../../../utils/jest/extends')

const domainUser = require('.')
const globalMock = require('../../../utils/Mocks/global')
const factory = require('../../../utils/Mocks/factories')
const fackers = require('../../../utils/Mocks/fakers')
const formatterDbValues = require('../../../utils/formatterDbValues')

describe('user domain', () => {
  describe('create', () => {
    let company = null
    let userPayload = null

    beforeAll(async () => {
      company = await factory.create('company')
    })

    beforeEach(() => {
      userPayload = {
        ...fackers.userFaker(),
        companyId: company.id
      }
    })

    it('should be able create new user', async () => {
      expect.assertions(2)

      const userCreated = await domainUser.create(userPayload)

      expect(userCreated).toStrictEqual(
        expect.objectContaining(omit(['password'], userPayload))
      )

      await expect(
        compare('123456', userCreated.password)
      ).resolves.toBeTruthy()
    })

    it('should not be create user without document', async () => {
      expect.assertions(1)

      await expect(
        domainUser.create(omit(['document'], userPayload))
      ).rejects.toThrow(
        new ValidationError('notNull Violation: user.document cannot be null')
      )
    })
  })

  describe('get', () => {
    let usersFactory = []

    beforeAll(async () => {
      usersFactory = await factory.createMany('user', 2, {
        companyId: globalMock.company.id
      })
    })

    it('should get the users', async () => {
      expect.hasAssertions()

      const users = await domainUser.getAll({
        companyGroupId: globalMock.company.companyGroupId
      })

      expect(users).toHaveProperty('count')
      expect(users.count).toBeGreaterThan(0)
      expect(users).toHaveProperty('rows')
      // expect(formatterDbValues(users.rows)).toStrictEqual(
      //   expect.arrayContaining(formatterDbValues(usersFactory))
      // )

      users.rows.forEach((row) => {
        expect(formatterDbValues(row)).toStrictEqual(
          expect.objectContaining({
            id: expect.toBeUUID(),
            name: expect.any(String),
            companyId: expect.toBeUUID(),
            document: expect.stringMatching(/\d/g),
            password: expect.any(String),
            userType: expect.stringMatching(
              /colaborator|colaborator_external|driver/
            ),
            activated: true,
            createdAt: expect.toBeDate(),
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

    it('should be able get user by id', async () => {
      expect.hasAssertions()

      const user = usersFactory[0]

      const userFound = await domainUser.getById(user.id)

      expect(formatterDbValues(userFound)).toStrictEqual(
        formatterDbValues(user)
      )
    })
  })

  describe('update', () => {
    let userFactory = null

    beforeEach(async () => {
      userFactory = await factory.create('user', {
        companyId: globalMock.company.id
      })
    })

    it('should be able update a user', async () => {
      expect.assertions(1)

      const newValues = fackers.userFaker({ companyId: userFactory.companyId })
      const userUpdated = await domainUser.update(userFactory.id, newValues)

      expect(formatterDbValues(userUpdated)).toMatchObject(newValues)
    })

    it('should not be able upate if the id passed was invalid', async () => {
      expect.assertions(1)

      const newValues = fackers.companyFaker()
      await expect(domainUser.update(null, newValues)).rejects.toThrow(
        new Error('User not found')
      )
    })
  })
})

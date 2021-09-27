const { ValidationError } = require('sequelize')
const { omit, replace } = require('ramda')
const cnpj = require('@fnando/cnpj/commonjs')

const domainCompany = require('.')
const globalMock = require('../../../utils/Mocks/global')
const factory = require('../../../utils/Mocks/factories')
const fackers = require('../../../utils/Mocks/fakers')
const formatterDbValues = require('../../../utils/formatterDbValues')

describe('comapany domain', () => {
  describe('create', () => {
    let companyGroup = null
    let companyPayload = {}

    beforeAll(async () => {
      companyGroup = await factory.create('companyGroup')
    })

    beforeEach(() => {
      companyPayload = {
        ...fackers.companyFaker(),
        companyGroupId: companyGroup.id
      }
    })

    it('should be able create new company', async () => {
      expect.assertions(1)

      await expect(domainCompany.create(companyPayload)).resolves.toStrictEqual(
        expect.objectContaining({
          ...companyPayload
        })
      )
    })

    it('should not be create company without document', async () => {
      expect.assertions(1)

      await expect(
        domainCompany.create(omit(['document'], companyPayload))
      ).rejects.toThrow(
        new ValidationError(
          'notNull Violation: company.document cannot be null'
        )
      )
    })

    it('should be create company without mask on document when passed document masked', async () => {
      expect.assertions(1)

      const documentMasked = cnpj.format(companyPayload.document)
      const documentWithoutMask = replace(/\D/g, '', documentMasked)

      await expect(
        domainCompany.create({
          ...companyPayload,
          document: documentMasked
        })
      ).resolves.toStrictEqual(
        expect.objectContaining({
          ...companyPayload,
          document: documentWithoutMask
        })
      )
    })
  })

  describe('get', () => {
    let companiesFactory = []

    beforeAll(async () => {
      companiesFactory = await factory.createMany('company', 2, {
        companyGroupId: globalMock.companyGroup.id
      })
    })

    it('should get the companies', async () => {
      expect.assertions(4)

      const comapnies = await domainCompany.getAll()

      expect(comapnies).toHaveProperty('count')
      expect(comapnies.count).toBeGreaterThan(0)
      expect(comapnies).toHaveProperty('rows')
      expect(formatterDbValues(comapnies.rows)).toStrictEqual(
        expect.arrayContaining(formatterDbValues(companiesFactory))
      )
    })

    it('should be able get company by id', async () => {
      expect.hasAssertions()

      const comapany = companiesFactory[0]

      const companyFound = await domainCompany.getById(comapany.id)

      expect(formatterDbValues(companyFound)).toStrictEqual(
        formatterDbValues(comapany)
      )
    })
  })

  describe('update', () => {
    let companyFactory = null

    beforeEach(async () => {
      companyFactory = await factory.create('company', {
        companyGroupId: globalMock.companyGroup.id
      })
    })
    it('should be able update a company', async () => {
      expect.assertions(1)

      const newValues = fackers.companyFaker()
      const comapnyUpdated = await domainCompany.update(
        companyFactory.id,
        newValues
      )

      expect(formatterDbValues(comapnyUpdated)).toMatchObject(newValues)
    })

    it('should not be able upate if the id passed was invalid', async () => {
      expect.assertions(1)

      const newValues = fackers.companyFaker()
      await expect(domainCompany.update(null, newValues)).rejects.toThrow(
        new Error('Company not found')
      )
    })
  })
})

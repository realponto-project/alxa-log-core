require('../../utils/jest/extends')
const domainDriverIncident = require('.')
const faker = require('../../utils/Mocks/fakers')
const facatory = require('../../utils/Mocks/factories')
const formatterDbValues = require('../../utils/formatterDbValues')

describe('domain driver incident', () => {
  let companyFactory = null
  let userFactory = null
  let vehicleFactory = null
  let operationFactory = null
  let driverFactory = null

  beforeAll(async () => {
    companyFactory = await facatory.create('company')
    userFactory = await facatory.create('user')
    vehicleFactory = await facatory.create('vehicle')
    operationFactory = await facatory.create('operation')
    driverFactory = await facatory.create('driver')
  })

  describe('create', () => {
    it('should be able create new incident', async () => {
      expect.assertions(1)

      const driverIncidentMock = faker.driverIncidentFaker({
        companyId: companyFactory.id,
        userId: userFactory.id,
        vehicleId: vehicleFactory.id,
        operationId: operationFactory.id,
        driverId: driverFactory.id
      })

      await expect(
        domainDriverIncident.create(driverIncidentMock)
      ).resolves.toStrictEqual(expect.objectContaining(driverIncidentMock))
    })
  })

  describe('update', () => {
    let driverIncidentFactory = null

    beforeAll(async () => {
      driverIncidentFactory = await facatory.create('driverIncident')
    })

    it('should be able update a incident', async () => {
      expect.assertions(1)

      const driverIncidentMock = faker.driverIncidentFaker()

      await expect(
        domainDriverIncident.update(
          driverIncidentFactory.id,
          driverIncidentMock
        )
      ).resolves.toStrictEqual(expect.objectContaining(driverIncidentMock))
    })
  })

  describe('get', () => {
    beforeAll(async () => {
      await facatory.createMany('driverIncident', 2)
    })
    it('should ba able get many incidents by driverId', async () => {
      expect.hasAssertions()

      const incidents = await domainDriverIncident.getAll()

      expect(incidents).toHaveProperty('count')
      expect(incidents.count).toBeGreaterThan(0)
      expect(incidents).toHaveProperty('rows')
      incidents.rows.forEach((row) => {
        expect(formatterDbValues(row)).toStrictEqual(
          expect.objectContaining({
            id: expect.toBeUUID()
            // name: expect.any(String),
            // createdAt: expect.toBeDate(),
            // updatedAt: expect.toBeDate(),
            // userId: expect.toBeUUID(),
            // company: expect.objectContaining({
            //   id: expect.toBeUUID(),
            //   name: expect.any(String),
            //   document: expect.stringMatching(/\d/g),
            //   type: expect.stringMatching(/filial|matriz/),
            //   zipcode: expect.stringMatching(/\d/g),
            //   street: expect.any(String),
            //   streetNumber: expect.any(String),
            //   neighborhood: expect.any(String),
            //   city: expect.any(String),
            //   state: expect.any(String),
            //   createdAt: expect.toBeDate(),
            //   updatedAt: expect.toBeDate(),
            //   companyGroupId: globalMock.company.companyGroupId
            // })
          })
        )
      })
    })
  })
})

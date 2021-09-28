const {
  propOr,
  applySpec,
  multiply,
  prop,
  keys,
  pipe,
  filter,
  __,
  mergeAll,
  map,
  assoc,
  ifElse,
  always
} = require('ramda')
const Sequelize = require('sequelize')

const database = require('../../../database')

const CompanyModel = database.model('company')
const VehicleTypeModel = database.model('vehicleType')

const {
  Op: { iLike }
} = Sequelize

const removeKeysWithUndefinedValues = (obj) => {
  return pipe(
    keys,
    filter(prop(__, obj)),
    map((key) => assoc(key, prop(key, obj), {})),
    mergeAll
  )(obj)
}

const calcOffset = (obj) =>
  multiply(propOr(0, 'offset', obj), propOr(20, 'limit', obj))

class DomainVehicleType {
  async create(vehicleType, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await VehicleTypeModel.create(vehicleType, { transaction })

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const vehicleType = await VehicleTypeModel.findByPk(id)

    if (!vehicleType) throw new Error('Vehicle type not found')

    const response = await vehicleType.update(values, { transaction })

    return response
  }

  async getAll(query) {
    const buildQuery = applySpec({
      where: pipe(
        applySpec({
          name: ifElse(
            prop('name'),
            pipe(prop('name'), (value) => ({ [iLike]: '%' + value + '%' })),
            always(null)
          )
        }),
        removeKeysWithUndefinedValues
      ),
      limit: propOr(20, 'limit'),
      offset: calcOffset,
      include: applySpec({
        model: always(CompanyModel),
        where: pipe(
          applySpec({
            companyGroupId: prop('companyGroupId')
          })
        )
      })
    })

    const response = await VehicleTypeModel.findAndCountAll(buildQuery(query))

    return response
  }

  async getById(id) {
    const response = await VehicleTypeModel.findByPk(id)

    return response
  }
}

module.exports = new DomainVehicleType()

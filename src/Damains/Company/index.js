const {
  propOr,
  applySpec,
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

class DomainCompany {
  async create(company, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const response = await CompanyModel.create(company, { transaction })

    return response
  }

  async getAll(query) {
    const buildQuery = applySpec({
      where: pipe(
        applySpec({
          companyGroupId: prop('companyGroupId'),
          document: prop('document'),
          name: ifElse(
            prop('name'),
            pipe(prop('name'), (value) => ({ [iLike]: '%' + value + '%' })),
            always(null)
          )
        }),
        removeKeysWithUndefinedValues
      ),
      limit: propOr(20, 'limit'),
      offset: propOr(0, 'offset')
    })

    const response = await CompanyModel.findAndCountAll(buildQuery(query))

    return response
  }

  async getById(id) {
    const response = await CompanyModel.findByPk(id)

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const company = await CompanyModel.findByPk(id)

    if (!company) throw new Error('Company not found')

    const response = await company.update(values, { transaction })

    return response
  }
}

module.exports = new DomainCompany()

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
const { hash, compare } = require('bcrypt')
const Sequelize = require('sequelize')

const database = require('../../../database')

const UserModel = database.model('user')
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

const calcOffset = (obj) =>
  multiply(propOr(0, 'offset', obj), propOr(20, 'limit', obj))

class DomainUser {
  async create(user, options = {}) {
    const transaction = propOr(null, 'transaction', options)

    const password = await hash('123456', 10)

    const response = await UserModel.create(
      { ...user, password },
      { transaction }
    )
    return response
  }

  async getAll(query) {
    const buildQuery = applySpec({
      where: pipe(
        applySpec({
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

    const response = await UserModel.findAndCountAll(buildQuery(query))

    return response
  }

  async getById(id) {
    const response = await UserModel.findByPk(id)

    return response
  }

  async update(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)
    const companyId = prop('companyId', values)

    const user = await UserModel.findByPk(id)

    if (!user) throw new Error('User not found')

    if (companyId !== user.companyId) throw new Error('Permission denied!')

    const response = await user.update(values, { transaction })

    return response
  }

  async updatePassword(id, values, options = {}) {
    const transaction = propOr(null, 'transaction', options)
    const { companyId, password, newPassword } = values

    const user = await UserModel.findByPk(id)

    if (!user) throw new Error('User not found')

    if (companyId !== user.companyId) throw new Error('Permission denied!')

    const checkedPassword = await compare(password, user.password)

    if (!checkedPassword) {
      throw new Error('Username or password do not match')
    }

    const passwordHash = await hash(newPassword, 10)

    const response = await user.update(
      { password: passwordHash },
      { transaction }
    )

    return response
  }
}

module.exports = new DomainUser()

const { propOr, applySpec, prop, always } = require('ramda')
const { hash, compare } = require('bcrypt')

const database = require('../../../database')
const { buildQueryPagnation, buildWhere } = require('../../utils')

const UserModel = database.model('user')
const CompanyModel = database.model('company')

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
      where: buildWhere(['document', ['name', 'iLike']]),
      include: applySpec({
        model: always(CompanyModel),
        where: buildWhere(['companyGroupId'])
      })
    })

    const response = await UserModel.findAndCountAll({
      ...buildQueryPagnation(query),
      ...buildQuery(query)
    })

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

const database = require('../../database')
const globalMock = require('../../src/utils/Mocks/global');

const CompanyGroupModel = database.model('companyGroup')
const CompanyModel = database.model('company')
const UserModel = database.model('user')

module.exports = async () => {
  await CompanyGroupModel.findOrCreate({ where: globalMock.companyGroup })
  await CompanyModel.findOrCreate({ where: globalMock.company })
  await UserModel.findOrCreate({ where: globalMock.user })
}

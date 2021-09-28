const database = require('../../database')

const globalMock = require('../../utils/Mocks/global');

const CompanyGroupModel = database.model('companyGroup')
const CompanyModel = database.model('company')

module.exports = async () => {
  await CompanyGroupModel.findOrCreate({ where: globalMock.companyGroup })
  await CompanyModel.findOrCreate({ where: globalMock.company })
}

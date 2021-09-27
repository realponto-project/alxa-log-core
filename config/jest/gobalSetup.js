const database = require('../../database')

const globalMock = require('../../utils/Mocks/global');

const CompanyGroupModel = database.model('companyGroup')

module.exports = async () => {
  await CompanyGroupModel.findOrCreate({ where: globalMock.companyGroup })
}

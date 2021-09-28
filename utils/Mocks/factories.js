const { factory } = require("factory-girl");
const { merge } = require("ramda");
// const { random, date } = require('faker')

const database = require("../../database");

const { companyGroupFaker, companyFaker, userFaker } = require("./fakers");

const CompanyGroupModel = database.model("companyGroup");
const CompanyModel = database.model("company");
const UserModel = database.model('user')

factory.define("companyGroup", CompanyGroupModel, companyGroupFaker);

factory.define("company", CompanyModel, (attrs) =>
  companyFaker(
    merge(
      {
        companyGroupId: factory.assoc("companyGroup", "id"),
      },
      attrs
    )
  )
);

factory.define("user", UserModel, userFaker)

module.exports = factory;

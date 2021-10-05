const { pathOr, pipe, multiply, path } = require("ramda");
const Sequelize = require("sequelize");
const moment = require("moment");

const database = require("../../database");
const domainDriver = require('../../src/Domains/Driver');

const DriverModel = database.model("driver");
const DriverIncidentModel = database.model("driverIncident");

const { Op: { lte } } = Sequelize;

const create = async (req, res, next) => {
  const userId = pathOr(null, ["decoded", "user", "id"], req);
  const companyId = pathOr(null, ["decoded", "user", "companyId"], req);
  const transaction = await database.transaction()

  try {
    const response = await domainDriver.create({ ...req.body, userId, companyId })
  
    res.json(response);
    await transaction.commit();
  } catch (error) {
    res.status(400).json({ error: error.message });
    await transaction.rollback();
  }
};

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  try {

    const response = await domainDriver.update(req.params.id, req.body, { transaction } )
    res.json(response);
    await transaction.commit();
  } catch (error) {
    res.status(400).json({ error });
    await transaction.rollback();
  }
};

const getById = async (req, res, next) => {
  try {
    const response = await domainDriver.getById(req.params.id);

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res, next) => {
  const companyGroupId = pathOr(null, ['decoded', 'user', 'companyGroupId'], req)

  try {
    const response = await domainDriver.getAll({...req.query, companyGroupId})

    res.json(response);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getSummaryExpire = async (req, res, next) => {
  try {
    const countExpireDriverLicense = await DriverModel.count({
      where: { expireDriverLicense: { [lte]: moment().startOf("day") } },
    });
    const countExpireProtocolInsuranceCompany = await DriverModel.count({
      where: {
        expireProtocolInsuranceCompany: { [lte]: moment().startOf("day") },
      },
    });
    const countExpireASO = await DriverModel.count({
      where: { expireASO: { [lte]: moment().startOf("day") } },
    });

    res.json({
      countExpireDriverLicense,
      countExpireProtocolInsuranceCompany,
      countExpireASO,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getIncidentsSummary = async (req, res, next) => {
  const driverId = pathOr(null, ["params", "id"], req);

  try {
    const response = await DriverIncidentModel.findAll({
      where: { driverId },
      attributes: [
        "incidentType",
        [Sequelize.fn("COUNT", Sequelize.col("incidentType")), "count"],
      ],
      group: ["incidentType"],
    });
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  create,
  update,
  getById,
  getAll,
  getSummaryExpire,
  getIncidentsSummary,
};

const { pathOr, pipe, multiply, path } = require("ramda");
const Sequelize = require("sequelize");
const moment = require("moment");

const database = require("../../database");

const DriverModel = database.model("driver");
const DriverIncidentModel = database.model("driverIncident");
const AuthorizationModel = database.model("authorization");
const CompanyModel = database.model("company");
const UserModel = database.model("user");
const OperationModel = database.model("operation");
const VehicleModel = database.model("vehicle");

const { Op } = Sequelize;
const { or, iLike, eq, and, gte, lte } = Op;

const buildQueryDriver = ({ driverId, dates, operationId, incidentType }) => {
  let where = { driverId };

  if (operationId) {
    where = {
      ...where,
      operationId,
    };
  }

  if (incidentType) {
    where = {
      ...where,
      incidentType,
    };
  }

  if (dates.length > 0) {
    where = {
      ...where,
      incidentDate: {
        [gte]: moment(dates[0]).startOf("day").toISOString(),
        [lte]: moment(dates[1]).endOf("day").toISOString(),
      },
    };
  }

  return where;
};

const buildQueryVehicle = ({ plate }) => {
  let where = {};

  if (plate) {
    where = {
      ...where,
      [or]: [
        {
          plate: { [iLike]: "%" + plate + "%" },
        },
      ],
    };
  }

  return where;
};
const create = async (req, res, next) => {
  const userId = pathOr(null, ["decoded", "user", "id"], req);
  const companyId = pathOr(null, ["decoded", "user", "companyId"], req);

  try {
    const response = await DriverModel.create(
      { ...req.body, userId, companyId, authorizationOnboarding: false },
      { include: [] }
    );
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res, next) => {
  try {
    const findUser = await DriverModel.findByPk(req.params.id, { include: [] });
    await findUser.update(req.body);
    const response = await findUser.reload();
    res.json(response);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getById = async (req, res, next) => {
  try {
    const response = await DriverModel.findByPk(req.params.id);

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllIncidentByDriverId = async (req, res, next) => {
  const limit = pipe(pathOr("20", ["query", "limit"]), Number)(req);
  const offset = pipe(
    pathOr("0", ["query", "offset"]),
    Number,
    multiply(limit)
  )(req);
  const driverId = pathOr([], ["params", "id"], req);
  const dates = pathOr([], ["query", "dates"], req);
  const operationId = pathOr(null, ["query", "operationId"], req);
  const plate = pathOr(null, ["query", "plate"], req);
  const incidentType = pathOr(null, ["query", "incidentType"], req);

  const whereDriver = buildQueryDriver({
    dates,
    operationId,
    incidentType,
    driverId,
  });
  const whereVehicle = buildQueryVehicle({ plate });

  try {
    const incidents = await DriverIncidentModel.findAndCountAll({
      include: [
        {
          model: OperationModel,
          include: CompanyModel,
        },
        {
          model: VehicleModel,
          where: whereVehicle,
        },
      ],
      where: whereDriver,
      limit,
      offset,
    });

    res.json(incidents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res, next) => {
  const limit = pathOr(20, ["query", "limit"], req);
  const offset = pathOr(0, ["query", "offset"], req);
  const driverLicense = pathOr(null, ["query", "driverLicense"], req);
  const name = pathOr(null, ["query", "name"], req);
 

  const isDriverLicense = driverLicense
    ? { driverLicense: { [iLike]: "%" + driverLicense + "%" } }
    : null;
  const isName = name ? { name: { [iLike]: "%" + name + "%" } } : null;
  let where = {};

  if (isDriverLicense) {
    where = isDriverLicense;
  }

  if (isName) {
    where = isName;
  }
  const expires = [
    'expireDriverLicense',
    'expireASO',
    'expireProtocolInsuranceCompany',
  ];

  expires.forEach(expire => {
    const expireValue = path(["query", expire], req);
    if (expireValue) {
      where[expire] = {
        [gte]: moment(expireValue[0]).startOf("day").toISOString(),
        [lte]: moment(expireValue[1]).startOf("day").toISOString(),
      };
    }
  })

  try {
    const response = await DriverModel.findAndCountAll({
      where,
      limit,
      offset: offset * limit,
    });

    const countExpireDriverLicense = await DriverModel.count({
      where: {...where, expireDriverLicense: { [lte]: moment().startOf("day") } },
    });
    const countExpireProtocolInsuranceCompany = await DriverModel.count({
      where: {...where,
        expireProtocolInsuranceCompany: { [lte]: moment().startOf("day") },
      },
    });
    const countExpireASO = await DriverModel.count({
      where: {...where, expireASO: { [lte]: moment().startOf("day") } },
    });

    res.json({...response,
      countExpireDriverLicense,
      countExpireProtocolInsuranceCompany,
      countExpireASO, });
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

const createIncident = async (req, res, next) => {
  const userId = pathOr(null, ["decoded", "user", "id"], req);
  const companyId = pathOr(null, ["decoded", "user", "companyId"], req);

  try {
    const response = await DriverIncidentModel.create(
      { ...req.body, userId, companyId },
      {
        include: [
          OperationModel,
          CompanyModel,
          UserModel,
          VehicleModel,
          DriverModel,
        ],
      }
    );
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateIncident = async (req, res, next) => {
  const incidentId = pathOr(null, ["params", "id"], req);
  const payload = pathOr(null, ["body"], req);

  try {
    const response = await DriverIncidentModel.findByPk(incidentId);
    await response.update(payload);
    await response.reload();

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  createIncident,
  getIncidentsSummary,
  getAllIncidentByDriverId,
  updateIncident,
};

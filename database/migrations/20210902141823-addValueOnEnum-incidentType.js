"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "driverIncidents",
          "incidentType",
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.dropEnum("enum_driverIncidents_incidentType", {
          transaction: t,
        }),
        queryInterface.changeColumn(
          "driverIncidents",
          "incidentType",
          {
            type: Sequelize.ENUM([
              "accident",
              "collision",
              "vehicle_break_down",
              "refusal_of_freight",
              "absence_without_justification",
              "absence_with_justification",
              "speeding",
              "lack_of_PPE",
              "lack_of_cargo_lashing",
            ]),
            allowNull: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "driverIncidents",
          "incidentType",
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.dropEnum("enum_driverIncidents_incidentType", {
          transaction: t,
        }),
        // queryInterface.changeColumn(
        //   "driverIncidents",
        //   "incidentType",
        //   {
        //     type: Sequelize.ENUM([
        //       "accident",
        //       "collision",
        //       "vehicle_break_down",
        //     ]),
        //     allowNull: false,
        //   },
        //   { transaction: t }
        // ),
      ]);
    });
  },
};

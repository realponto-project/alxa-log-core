'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_enum_maintenance_order_status" ADD VALUE 'external_service'`
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DELETE 
        FROM
            pg_enum
        WHERE
            enumlabel = 'external_service' AND
            enumtypid = (
                SELECT
                    oid
                FROM
                    pg_type
                WHERE
                    typname = 'enum_enum_maintenance_order_status'
            )
    `)
  }
}
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'vehicleTypes',
      [
        {
          "id": "a749e0ab-e203-412f-95fa-59314b10dd00",
          "name": "Carreta",
          "createdAt": "2021-07-08T13:22:06.738Z",
          "updatedAt": "2021-07-08T13:22:06.738Z",
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "userId": "30731a37-7607-46c0-aa55-c5c86f06b2c7"
        },
        {
          "id": "089c926f-8da9-4373-b4ec-389a5013184e",
          "name": "Cavalo Mecânico",
          "createdAt": "2021-07-08T13:22:15.945Z",
          "updatedAt": "2021-07-08T13:22:15.945Z",
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "userId": "30731a37-7607-46c0-aa55-c5c86f06b2c7"
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('vehicleTypes', null, {})
}
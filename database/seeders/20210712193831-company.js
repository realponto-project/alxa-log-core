'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'companies',
      [
        {
          "id": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "name": "JSL FREI DAMIÃO",
          "document": "52548435012266",
          "type": "filial",
          "zipcode": "09695100",
          "street": "Rua Frei Damião",
          "streetNumber": "865",
          "neighborhood": "Paulicéia",
          "city": "Sao Bernardo do Campo",
          "state": "SP",
          "createdAt": "2021-07-08T00:25:05.948Z",
          "updatedAt": "2021-07-08T11:48:29.557Z"
        },
        {
          "id": "2d7d9602-89fd-4e34-87ff-40d2c6d619f3",
          "name": "JSL MANUTENÇÃO SBC",
          "document": "52548435021842",
          "type": "filial",
          "zipcode": "09842-100",
          "street": "Estrada da Cama Patente",
          "streetNumber": "2300",
          "neighborhood": "Alvarenga",
          "city": "São Bernardo do Campo",
          "state": "SP",
          "createdAt": "2021-07-12T12:52:01.757Z",
          "updatedAt": "2021-07-12T12:52:16.118Z"
        },
        {
          "id": "ad7996c9-cab8-47d8-a89d-4a7a1f2a3272",
          "name": "JSL CUBATÃO",
          "document": "52548435000764",
          "type": "filial",
          "zipcode": "11573-000",
          "street": "Rod. Cônego Domênico Rangoni, S/N - ",
          "streetNumber": "S/ N°",
          "neighborhood": "Zona Industrial",
          "city": "Cubatão",
          "state": "São Paulo",
          "createdAt": "2021-07-12T15:04:23.071Z",
          "updatedAt": "2021-07-12T15:04:23.071Z"
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('companies', null, {})
}
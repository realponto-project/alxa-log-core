'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'operations',
      [
        {
          "id": "764aaa89-0f88-4df4-9774-1cf2bf03b02b",
          "name": "Mercedes-Benz",
          "vacancy": 0,
          "createdAt": "2021-07-08T11:49:05.830Z",
          "updatedAt": "2021-07-08T11:49:05.830Z",
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "userId": "30731a37-7607-46c0-aa55-c5c86f06b2c7"
        },
        {
          "id": "f9c92471-2ea7-4db0-a371-bedbc32f2f82",
          "name": "Scania",
          "vacancy": 0,
          "createdAt": "2021-07-08T11:49:31.916Z",
          "updatedAt": "2021-07-08T11:49:31.916Z",
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "userId": "30731a37-7607-46c0-aa55-c5c86f06b2c7"
        },
        {
          "id": "7de8e5fb-b978-4685-a0e5-951eaab374af",
          "name": "Lear",
          "vacancy": 0,
          "createdAt": "2021-07-12T14:18:02.669Z",
          "updatedAt": "2021-07-12T14:18:02.669Z",
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "userId": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0"
        },
        {
          "id": "dcb85f47-4719-4712-9788-c3f9d5159938",
          "name": "GM Interplantas",
          "vacancy": 0,
          "createdAt": "2021-07-12T14:31:47.979Z",
          "updatedAt": "2021-07-12T14:31:47.979Z",
          "companyId": "2d7d9602-89fd-4e34-87ff-40d2c6d619f3",
          "userId": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0"
        },
        {
          "id": "701b6e3c-3a1d-42bd-bf02-1dfa869662d2",
          "name": "Renault",
          "vacancy": 0,
          "createdAt": "2021-07-12T14:42:33.896Z",
          "updatedAt": "2021-07-12T14:42:33.896Z",
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723",
          "userId": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0"
        },
        {
          "id": "7440a917-510d-4c1d-a07e-fb1578f06d67",
          "name": "Volkswagen",
          "vacancy": 0,
          "createdAt": "2021-07-12T14:55:20.126Z",
          "updatedAt": "2021-07-12T14:55:20.126Z",
          "companyId": "2d7d9602-89fd-4e34-87ff-40d2c6d619f3",
          "userId": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0"
        },
        {
          "id": "e8db2ad0-cc4d-48c1-9a97-247700bf6730",
          "name": "Volkswagen Curitiba",
          "vacancy": 0,
          "createdAt": "2021-07-12T14:56:14.049Z",
          "updatedAt": "2021-07-12T14:56:14.049Z",
          "companyId": "2d7d9602-89fd-4e34-87ff-40d2c6d619f3",
          "userId": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0"
        },
        {
          "id": "af905a20-7339-4ca5-b73b-494606a4d824",
          "name": "Cubatão",
          "vacancy": 0,
          "createdAt": "2021-07-12T15:06:12.368Z",
          "updatedAt": "2021-07-12T15:06:12.368Z",
          "companyId": "ad7996c9-cab8-47d8-a89d-4a7a1f2a3272",
          "userId": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0"
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('operations', null, {})
}
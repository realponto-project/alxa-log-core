'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'users',
      [
        {
          "id": "8790f64c-7395-4f03-b1a0-a91ee5c79605",
          "name": "Thiago Ramalho de Souza",
          "document": "39494994825",
          "password": "$2b$10$/AZ2lXOznBFHPAcljuMdAuk/9eb1fLY2vm.Q7d.CR7d.Y3rRR/.4K",
          "createdAt": "2021-07-08T13:51:45.131Z",
          "updatedAt": "2021-07-08T13:51:45.131Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "5ef48621-878f-4860-9309-b0151df73b0a",
          "name": "Adriano Batista Lisboa",
          "document": "15775141814",
          "password": "$2b$10$r7pumEdxH6gla/HqVVnrd.xVhFxsQxvqDxySAurQjx.ersjaXx5cO",
          "createdAt": "2021-07-08T13:52:52.186Z",
          "updatedAt": "2021-07-08T13:52:52.186Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "9058228f-6843-4307-b422-472db8d55582",
          "name": "Adilson de Jesus Ferreira",
          "document": "88061752620",
          "password": "$2b$10$8FFZ8NZ7k48OwWCSCmw21.Vzd2d9xErM7WHrYgpQssdlDlDKRfFWu",
          "createdAt": "2021-07-08T19:07:29.450Z",
          "updatedAt": "2021-07-08T19:07:29.450Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "293edd60-6a25-4596-8668-5ff341fca03d",
          "name": "Henrique Silva Santos",
          "document": "41242663835",
          "password": "$2b$10$7iK13/fqVpmI0B.i0JtpZOY1/jZ1coBy4ggwKv3LhXTIxsNfQbkcq",
          "createdAt": "2021-07-12T12:14:16.564Z",
          "updatedAt": "2021-07-12T12:14:16.564Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "19b0e8be-c577-40bb-90ee-011916da825a",
          "name": "Taciana Cruz Onofre",
          "document": "30431595860",
          "password": "$2b$10$w9WAW.ipNZbW..ppNs.rIu6CwopfuNfVACIoEBxVC4xbbRVDWctLO",
          "createdAt": "2021-07-12T12:19:13.407Z",
          "updatedAt": "2021-07-12T12:19:13.407Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "d86f56c8-fdfb-4ec7-b3bb-1cb3461066c6",
          "name": "Geovanna Cristine de Oliveira Gomes",
          "document": "49889430894",
          "password": "$2b$10$cE4R5wLVhBfqUvOFgiJREuxRthMGghMv5v5RlPjBoYNlX1HzdfOQa",
          "createdAt": "2021-07-12T12:19:43.735Z",
          "updatedAt": "2021-07-12T12:19:43.735Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "a265cd08-f43e-42e6-b1ec-b5f73dc206d0",
          "name": "Guilherme Henrique Gaspar Amalfi",
          "document": "51458467899",
          "password": "$2b$10$pJXbfN/MPH4kynA4I78PAuON43PtgrJ4j528g95XwS3ZsYX68EIwq",
          "createdAt": "2021-07-12T12:45:30.321Z",
          "updatedAt": "2021-07-12T12:45:30.321Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "249214b6-2229-496f-bad4-47a23a5f170c",
          "name": "Rafael Augusto da Silva",
          "document": "39367016875",
          "password": "$2b$10$ocXUfnWMOHVoe.EkKJyzyObabDT.UeC62ZWk1u8PZJCkrjUmmunEK",
          "createdAt": "2021-07-12T12:53:08.551Z",
          "updatedAt": "2021-07-12T12:53:08.551Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "2706d7f8-e26e-4c56-b9da-e1c5a9ded9e0",
          "name": "Ivan Soares dos Santos",
          "document": "18586313866",
          "password": "$2b$10$LL6D/1wT1aoBhBzLul0CWeKJWLHKMqoataCsX44nPZQAscp16m2o6",
          "createdAt": "2021-07-12T13:11:30.209Z",
          "updatedAt": "2021-07-12T13:11:30.209Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        },
        {
          "id": "30731a37-7607-46c0-aa55-c5c86f06b2c7",
          "name": "Alexandre Santos",
          "document": "43947321821",
          "password": "$2b$10$O01Ck29IqEj5SmkntghqBOuFPtViMcds/k.FoRpkpcicR7T7Pg5T6",
          "createdAt": "2021-07-08T00:26:36.440Z",
          "updatedAt": "2021-07-12T18:08:45.980Z",
          "userType": "colaborator",
          "activated": true,
          "companyId": "ce21ee4a-4f62-4f98-a879-ba95e8833723"
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('users', null, {})
}
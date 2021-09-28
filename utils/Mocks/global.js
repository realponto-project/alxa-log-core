const companyGroup = {
  id: '6724abfc-f98b-4bc8-972d-50fc82c23439',
  name: 'Test Company Group Global'
}

const company = {
  companyGroupId: '6724abfc-f98b-4bc8-972d-50fc82c23439',
  id: "ce21ee4a-4f62-4f98-a879-ba95e8833723",
  name: "Test Company Global",
  document: "12345678901234",
  type: "filial",
  zipcode: "0000000",
  street: "Alameda Test",
  streetNumber: "55",
  neighborhood: "Jd. test",
  city: "Testelandia",
  state: "TS"
}

const user = {
  id: "30731a37-7607-46c0-aa55-c5c86f06b2c7",
  name: "Alexandre Santos",
  document: "43947321821",
  password: "$2b$10$O01Ck29IqEj5SmkntghqBOuFPtViMcds/k.FoRpkpcicR7T7Pg5T6",
  userType: "colaborator",
  activated: true,
  companyId: "ce21ee4a-4f62-4f98-a879-ba95e8833723"
}


module.exports = {
  companyGroup,
  company,
  user
};

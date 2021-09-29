const { validate: uuidValidate } = require('uuid')
const moment = require('moment');
const { pipe, or, isEmpty, isNil } = require('ramda');

const isEmptyOrNil = v => or(isEmpty(v), isNil(v))

expect.extend({
  toBeDate(received){
    let message = `${received} is valid date`
    let pass = true

    if(isEmptyOrNil(received)) {
      pass = false 
      message = 'expected not to be null/undefined/empty'
    } 

    if(!moment(received).isValid()){
      pass = false 
      message = `expected ${received} to be valid date`
    }
    
    const response = { pass, message }

    return response
  },

  toBeUUID(received){
    const messageSucess = `expected ${received} is uuid valid`
    const messageError = `expected ${received} is not uuid valid`

    const pass = uuidValidate(received) 
    
    const response = { 
      pass,
      message: pass ? messageSucess : messageError
    }

    return response
  }
});
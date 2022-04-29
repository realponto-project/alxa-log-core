const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api403Error extends BaseError {
  constructor(
    description,
    name = 'FORBIDDEN',
    statusCode = httpStatusCodes.FORBIDDEN,
    isOperational = true
  ) {
    super(description, name, statusCode, isOperational)
  }
}

module.exports = Api403Error

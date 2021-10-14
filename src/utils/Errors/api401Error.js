const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api401Error extends BaseError {
  constructor(
    description,
    name = 'UNAUTHORIZED',
    statusCode = httpStatusCodes.UNAUTHORIZED,
    isOperational = true
  ) {
    super(description, name, statusCode, isOperational)
  }
}

module.exports = Api401Error

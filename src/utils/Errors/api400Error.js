const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api400Error extends BaseError {
  constructor(
    description,
    name = 'BAD_REQUEST',
    statusCode = httpStatusCodes.BAD_REQUEST,
    isOperational = true
  ) {
    super(description, name, statusCode, isOperational)
  }
}

module.exports = Api400Error

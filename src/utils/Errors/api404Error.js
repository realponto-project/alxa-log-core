const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api404Error extends BaseError {
  constructor(
    description,
    name = 'NOT_FOUND',
    statusCode = httpStatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(description, name, statusCode, isOperational)
  }
}

module.exports = Api404Error

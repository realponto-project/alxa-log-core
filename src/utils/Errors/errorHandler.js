const { prop, pipe, applySpec, map } = require('ramda')
const { UniqueConstraintError } = require('sequelize')

const BaseError = require('./baseError')

const env = process.env.NODE_EN || 'development'

function logError(err, req) {
  console.error(err)
}

function logErrorMiddleware(err, req, res, next) {
  if (env === 'development') logError(err, req)
  next(err)
}

function returnError(err, req, res, next) {
  if (err instanceof UniqueConstraintError) {
    return res.status(400).json({
      message: 'duplicate key value violates unique constraint',
      errors: pipe(
        prop('errors'),
        map(
          applySpec({
            path: prop('path'),
            message: prop('message'),
            validatorKey: prop('validatorKey')
          })
        )
      )(err)
    })
  }

  res.status(err.statusCode || 500).json({ message: err.message })
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational
  }
  return false
}

module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError
}

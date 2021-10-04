const {
  multiply,
  propOr,
  applySpec,
  pipe,
  keys,
  filter,
  map,
  prop,
  __,
  assoc,
  mergeAll,
  ifElse,
  always,
  forEach,
  type,
  length,
  isEmpty,
  not,
  path
} = require('ramda')
const Sequelize = require('sequelize')
const moment = require('moment')

const {
  Op: { iLike, gte, lte }
} = Sequelize

const removeFiledsNilOrEmpty = (values) => {
  const fields = values
  const fieldFormmat = Object.keys(fields).reduce((curr, prev) => {
    if (!curr[prev] && fields[prev]) {
      if (fields[prev] === 'true') {
        curr = {
          ...curr,
          [prev]: true
        }
      }

      if (fields[prev] === 'false') {
        curr = {
          ...curr,
          [prev]: false
        }
      }

      if (fields[prev] !== 'true' && fields !== 'false') {
        curr = {
          ...curr,
          [prev]: fields[prev]
        }
      }
    }
    return curr
  }, {})

  return fieldFormmat
}

const removeKeysWithUndefinedValues = (obj) => {
  return pipe(
    keys,
    filter(prop(__, obj)),
    map((key) => assoc(key, prop(key, obj), {})),
    mergeAll
  )(obj)
}

const appplyILike = (propName) =>
  ifElse(
    prop(propName),
    pipe(prop(propName), (value) => ({ [iLike]: '%' + value + '%' })),
    always(null)
  )

const validateRangeDate = (propName) =>
  pipe(prop(propName), (value) => {
    if (type(value) !== 'Array' || length(value) !== 2) return false

    if (
      pipe(
        filter((item) => !moment(item).isValid()),
        isEmpty,
        not
      )(value)
    )
      return false

    return true
  })

const appplyRangeDate = (propName) =>
  ifElse(
    validateRangeDate(propName),
    pipe(prop(propName), (v) => ({
      [gte]: moment(v[0]).startOf('day').toISOString(),
      [lte]: moment(v[1]).startOf('day').toISOString()
    })),
    always(null)
  )

const calcOffset = (obj) =>
  multiply(propOr(0, 'offset', obj), propOr(20, 'limit', obj))

const applyOp = (propName, op) => {
  switch (op) {
    case 'iLike':
      return appplyILike(propName)
    case 'rangeDate':
      return appplyRangeDate(propName)
    case 'lteToday':
      return always({ [lte]: moment().startOf('day') })
  }

  return prop(propName)
}

const buildWhere = (props) => {
  const spec = {}

  forEach((item) => {
    if (type(item) === 'Array') {
      spec[item[0]] = applyOp(item[0], item[1])
    } else {
      spec[item] = prop(item)
    }
  }, props)

  return pipe(applySpec(spec), removeKeysWithUndefinedValues)
}

const buildQueryPagnation = applySpec({
  limit: propOr(20, 'limit'),
  offset: calcOffset
})

module.exports = {
  removeFiledsNilOrEmpty,
  appplyILike,
  buildQueryPagnation,
  removeKeysWithUndefinedValues,
  buildWhere
}

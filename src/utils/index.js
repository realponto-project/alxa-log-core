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
  type
} = require('ramda')
const Sequelize = require('sequelize')

const {
  Op: { iLike }
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

const calcOffset = (obj) =>
  multiply(propOr(0, 'offset', obj), propOr(20, 'limit', obj))

const applyOp = (propName, op) => {
  switch (op) {
    case 'iLike':
      return appplyILike(propName)
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

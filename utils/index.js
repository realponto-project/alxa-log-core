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

module.exports = removeFiledsNilOrEmpty

const _ = require('lodash')

function snakeKeys(params, merge = {}) {
  return _.mapKeys(
    Object.assign({}, params, merge),
    (value, key) => _.snakeCase(key)
  )
}

function camelKeys(params, merge = {}) {
  return _.mapKeys(
    Object.assign({}, params, merge),
    (value, key) => _.camelCase(key)
  )
}

_.mixin({
  snakeKeys,
  camelKeys,
})

module.exports = _

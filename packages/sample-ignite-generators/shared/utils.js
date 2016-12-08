const { camelCase, upperFirst } = require('lodash')
const { pipe } = require('ramda')

const capsCase = pipe(camelCase, upperFirst)

module.exports = {
  capsCase
}

const { curry, when } = require('ramda')

/**
 * Throws an error if the predicate fails when applying value.
 *
 * @export
 * @param {string} message - The message to say in the error
 * @param {Function} predicate - The function to invoke
 * @param {*} value - The value to apply to the predicate
 */
function throwWhen (message, predicate, value) {
  when(
    predicate,
    () => {
      throw new Error(message)
    },
    value
  )
}

module.exports = curry(throwWhen)

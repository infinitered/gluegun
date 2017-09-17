const semver = require('semver')

/**
 * Extensions to access semver and helpers
 *
 * @return {Function} A function to attach to the context.
 */
function attach () {
  const extension = semver // semver
  // Add bells and whistles here
  return extension
}

module.exports = attach

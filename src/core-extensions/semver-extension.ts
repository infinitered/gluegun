import * as semver from 'semver'

/**
 * Extensions to access semver and helpers
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  context.semver = semver
}

module.exports = attach

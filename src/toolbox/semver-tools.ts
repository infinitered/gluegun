import { GluegunSemver } from './semver-types'

/**
 * We're replicating the interface of semver in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
const semver: GluegunSemver = {
  valid: (...args) => require('semver').valid(...args),
  clean: (...args) => require('semver').clean(...args),
  satisfies: (...args) => require('semver').satisfies(...args),
  gt: (...args) => require('semver').gt(...args),
  lt: (...args) => require('semver').lt(...args),
  validRange: (...args) => require('semver').validRange(...args),
}

export { semver, GluegunSemver }

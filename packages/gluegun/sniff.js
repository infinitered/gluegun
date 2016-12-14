// check the node version
const semver = require('semver')

// the structure to return
const env = {}

env.nodeVersion = process.version.replace('v', '')
env.isNewEnough = semver.satisfies(env.nodeVersion, '>= 7.0.0')
env.hasAsyncAwait = false

// check for the harmony-enabled features
try {
  require('./src/utils/async-await-check')
  env.hasAsyncAwait = true
} catch (e) {
}

env.ok = env.hasAsyncAwait && env.isNewEnough

module.exports = env

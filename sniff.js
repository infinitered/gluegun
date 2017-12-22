// check the node version
const semver = require('semver')

const nodeMinimum = '7.6.0'
const nodeVersion = process.version.replace('v', '')
const isNewEnough = semver.satisfies(nodeVersion, '>= ' + nodeMinimum)
let hasAsyncAwait = false
let ok = false

// check for the harmony-enabled features
try {
  require('./sniff-async')
  hasAsyncAwait = true
} catch (e) {}

ok = hasAsyncAwait && isNewEnough

module.exports = {
  nodeMinimum,
  nodeVersion,
  isNewEnough,
  hasAsyncAwait,
  ok,
}

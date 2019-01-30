// check the node version

const nodeMinimum = '7.6.0'
const nodeVersion = process.version.replace('v', '')
const ver = nodeVersion.split('.').map(Number)
const isNewEnough = ver[0] > 7 || (ver[0] >= 7 && ver[1] >= 6)
let hasAsyncAwait = false
let ok = false

// check for async/await features, but only if below Node 8
if (ver[0] >= 8) {
  hasAsyncAwait = true
} else {
  try {
    require('./sniff-async')
    hasAsyncAwait = true
  } catch (e) {}
}

ok = hasAsyncAwait && isNewEnough

module.exports = {
  nodeMinimum,
  nodeVersion,
  isNewEnough,
  hasAsyncAwait,
  ok,
}

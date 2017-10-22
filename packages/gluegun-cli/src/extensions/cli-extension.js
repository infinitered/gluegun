const { resolve } = require('path')
const { chmodSync } = require('fs')

module.exports = (context) => {
  context.filesystem.resolve = resolve
  context.filesystem.chmodSync = chmodSync
  context.strings.kebabCase = (name) => name.replace(/([A-Z])/g, (a, o, i) => (i ? '-' : '') + a.toLowerCase()).replace(/([^a-z-]+)/, '')
}

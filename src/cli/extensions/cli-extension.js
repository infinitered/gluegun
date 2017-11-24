const { resolve } = require('path')
const { chmodSync } = require('fs')

module.exports = context => {
  context.filesystem.resolve = resolve
  context.filesystem.chmodSync = chmodSync
}

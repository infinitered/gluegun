import { chmodSync } from 'fs'
import { resolve } from 'path'

module.exports = context => {
  context.filesystem.resolve = resolve
  context.filesystem.chmodSync = chmodSync
}

import { chmodSync } from 'fs'
import { resolve } from 'path'

export default context => {
  context.filesystem.resolve = resolve
  context.filesystem.chmodSync = chmodSync
}

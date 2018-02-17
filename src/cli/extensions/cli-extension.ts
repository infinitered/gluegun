import { chmodSync } from 'fs'
import { resolve } from 'path'

export default toolbox => {
  toolbox.filesystem.resolve = resolve
  toolbox.filesystem.chmodSync = chmodSync
}

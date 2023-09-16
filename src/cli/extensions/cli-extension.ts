import { chmodSync } from 'fs'
import { resolve } from 'path'
import { GluegunToolbox } from '../../domain/toolbox'

export default (toolbox: GluegunToolbox) => {
  toolbox.filesystem.resolve = resolve
  toolbox.filesystem.chmodSync = chmodSync
}

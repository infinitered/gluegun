import { chmodSync } from 'fs'
import { resolve } from 'path'
import { GluegunToolbox } from '../../domain/toolbox'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.filesystem.resolve = resolve
  toolbox.filesystem.chmodSync = chmodSync
}

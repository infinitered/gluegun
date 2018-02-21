// first, do a sniff test to ensure our dependencies are met
const sniff = require('../sniff')

// check the node version
if (!sniff.isNewEnough) {
  console.log('Node.js 7.6+ is required to run. You have ' + sniff.nodeVersion + '. Womp, womp.')
  process.exit(1)
}

// we want to see real exceptions with backtraces and stuff
process.removeAllListeners('unhandledRejection')
process.on('unhandledRejection', up => {
  throw up
})

// export the `build` command
export { build } from './domain/builder'

// export the Gluegun interface
export { GluegunToolbox } from './domain/toolbox'
export { GluegunCommand } from './domain/command'

import { GluegunFilesystem } from './core-extensions/filesystem-types'
import { GluegunStrings } from './core-extensions/strings-types'
import { GluegunPrint } from './core-extensions/print-types'
import { GluegunSystem } from './core-extensions/system-types'
import { GluegunSemver } from './core-extensions/semver-types'
import { GluegunHttp } from './core-extensions/http-types'
import { GluegunPatching, GluegunPatchingPatchOptions } from './core-extensions/patching-types'
import { GluegunPrompt } from './core-extensions/prompt-types'
import { GluegunTemplate } from './core-extensions/template-types'
import { GluegunMeta } from './core-extensions/meta-types'
export {
  GluegunFilesystem,
  GluegunStrings,
  GluegunPrint,
  GluegunSystem,
  GluegunSemver,
  GluegunHttp,
  GluegunPatching,
  GluegunPatchingPatchOptions,
  GluegunPrompt,
  GluegunTemplate,
  GluegunMeta,
}

// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())

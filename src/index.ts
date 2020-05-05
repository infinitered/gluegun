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
export { GluegunToolbox, GluegunRunContext, GluegunParameters } from './domain/toolbox'
export { GluegunCommand } from './domain/command'

// export the toolbox
export { filesystem, GluegunFilesystem } from './toolbox/filesystem-tools'
export { strings, GluegunStrings } from './toolbox/string-tools'
export { print, GluegunPrint } from './toolbox/print-tools'
export { system, GluegunSystem } from './toolbox/system-tools'
export { semver, GluegunSemver } from './toolbox/semver-tools'
export { http, GluegunHttp } from './toolbox/http-tools'
export { patching, GluegunPatching, GluegunPatchingPatchOptions } from './toolbox/patching-tools'
export { prompt, GluegunPrompt } from './toolbox/prompt-tools'
export { packageManager, GluegunPackageManager } from './toolbox/package-manager-tools'

// TODO: can't export these tools directly as they require the toolbox to run
// need ideas on how to handle this
export { GluegunTemplate } from './toolbox/template-types'
export { GluegunMeta } from './core-extensions/meta-extension'

// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())

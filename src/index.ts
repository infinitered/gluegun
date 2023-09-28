import * as path from 'path'

// we want to see real exceptions with backtraces and stuff
process.removeAllListeners('unhandledRejection')
process.on('unhandledRejection', (up) => {
  throw up
})

// export the `build` command
export { build } from './domain/builder'

// export the Gluegun interface
export type { GluegunToolbox, GluegunRunContext, GluegunParameters } from './domain/toolbox'
export type { GluegunCommand } from './domain/command'

// export the toolbox
export { filesystem } from './toolbox/filesystem-tools'
export type { GluegunFilesystem } from './toolbox/filesystem-tools'
export { strings } from './toolbox/string-tools'
export type { GluegunStrings } from './toolbox/string-tools'
export { print } from './toolbox/print-tools'
export type { GluegunPrint } from './toolbox/print-tools'
export { system } from './toolbox/system-tools'
export type { GluegunSystem } from './toolbox/system-tools'
export { semver } from './toolbox/semver-tools'
export type { GluegunSemver } from './toolbox/semver-tools'
export { http } from './toolbox/http-tools'
export type { GluegunHttp } from './toolbox/http-tools'
export { patching } from './toolbox/patching-tools'
export type { GluegunPatching, GluegunPatchingPatchOptions } from './toolbox/patching-tools'
export { prompt } from './toolbox/prompt-tools'
export type { GluegunPrompt } from './toolbox/prompt-tools'
export { packageManager } from './toolbox/package-manager-tools'
export type { GluegunPackageManager } from './toolbox/package-manager-tools'

// TODO: can't export these tools directly as they require the toolbox to run
// need ideas on how to handle this
export type { GluegunTemplate } from './toolbox/template-types'
export type { GluegunMeta } from './core-extensions/meta-extension'

// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(path.join(__dirname, '..', 'node_modules'))
require('app-module-path').addPath(process.cwd())

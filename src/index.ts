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

// bring in a few extensions to make available for stand-alone purposes
import attachStringsExtension from './core-extensions/strings-extension'
import attachPrintExtension from './core-extensions/print-extension'
import attachFilesystemExtension from './core-extensions/filesystem-extension'
import attachSemverExtension from './core-extensions/semver-extension'
import attachSystemExtension from './core-extensions/system-extension'
import attachPromptExtension from './core-extensions/prompt-extension'
import attachHttpExtension from './core-extensions/http-extension'
import attachTemplateExtension from './core-extensions/template-extension'
import attachPatchingExtension from './core-extensions/patching-extension'

// export the `build` command
export { build } from './domain/builder'

// export the Gluegun interface
export { GluegunRunContext } from './domain/run-context'
export { GluegunCommand } from './domain/command'

import { GluegunFilesystem } from './core-extensions/filesystem-types'
import { GluegunStrings } from './core-extensions/strings-types'
import { GluegunPrint } from './core-extensions/print-types'
export { GluegunFilesystem, GluegunStrings, GluegunPrint }

// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())

// build a temporary context to hang things on
const context: any = {}

attachStringsExtension(context)
attachPrintExtension(context)
attachFilesystemExtension(context)
attachSemverExtension(context)
attachSystemExtension(context)
attachPromptExtension(context)
attachHttpExtension(context)
attachTemplateExtension(context)
attachPatchingExtension(context)

// some functions are available if you just `import { <things> } from 'gluegun'` directly
export const filesystem: GluegunFilesystem = context.filesystem
export const semver = context.semver
export const system = context.system
export const prompt = context.prompt
export const http = context.http
export const template = context.template
export const patching = context.patching
export const print: GluegunPrint = context.print
export const generate = context.generate
export const strings: GluegunStrings = context.strings

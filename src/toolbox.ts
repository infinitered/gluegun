import {
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
} from './index'

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

// build a temporary toolbox to hang things on
const toolbox: any = {}

// benchmark: with no extensions, 280ms, 48k bundle size
attachStringsExtension(toolbox) // +0ms, +0kb
attachPrintExtension(toolbox) // +45ms, +8kb
attachFilesystemExtension(toolbox) // +0ms, +0kb
attachSemverExtension(toolbox) // +0ms, +0kb
attachSystemExtension(toolbox) // +10ms, +8kb
attachPromptExtension(toolbox) // +100ms, +4kb
attachHttpExtension(toolbox) // +30ms, +0kb
attachTemplateExtension(toolbox) // +0ms, +4kb
attachPatchingExtension(toolbox) // +0ms, +6kb

// some functions are available if you just `import { <things> } from 'gluegun'` directly
export const strings: GluegunStrings = toolbox.strings
export const print: GluegunPrint = toolbox.print
export const filesystem: GluegunFilesystem = toolbox.filesystem
export const semver: GluegunSemver = toolbox.semver
export const system: GluegunSystem = toolbox.system
export const prompt: GluegunPrompt = toolbox.prompt
export const http: GluegunHttp = toolbox.http
export const template: GluegunTemplate = toolbox.template
export const patching: GluegunPatching = toolbox.patching
export const generate = toolbox.generate

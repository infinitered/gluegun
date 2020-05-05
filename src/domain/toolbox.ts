import { Runtime } from '../runtime/runtime'
import { Command } from './command'
import { Options } from './options'
import { Plugin } from './plugin'
import {
  GluegunFilesystem,
  GluegunStrings,
  GluegunPrint,
  GluegunSystem,
  GluegunSemver,
  GluegunHttp,
  GluegunPatching,
  GluegunPrompt,
  GluegunTemplate,
  GluegunMeta,
  GluegunPackageManager,
} from '..'

export interface GluegunParameters {
  /* The command arguments as an array. */
  array?: string[]
  /**
   * Any optional parameters. Typically coming from command-line
   * arguments like this: `--force -p tsconfig.json`.
   */
  options: Options
  /* Just the first argument. */
  first?: string
  /* Just the 2nd argument. */
  second?: string
  /* Just the 3rd argument. */
  third?: string
  /* Everything else after the command as a string. */
  string?: string
  /* The raw command with any named parameters. */
  raw?: any
  /* The original argv value. */
  argv?: any
  /* The currently running plugin name. */
  plugin?: string
  /* The currently running command name. */
  command?: string
}

// Temporary toolbox while building
export interface GluegunEmptyToolbox {
  [key: string]: any
}

// Final toolbox
export interface GluegunToolbox extends GluegunEmptyToolbox {
  // known properties
  config: Options
  result?: any
  parameters: GluegunParameters
  plugin?: Plugin
  command?: Command
  pluginName?: string
  commandName?: string
  runtime?: Runtime

  // known extensions
  filesystem: GluegunFilesystem
  http: GluegunHttp
  meta: GluegunMeta
  patching: GluegunPatching
  print: GluegunPrint
  prompt: GluegunPrompt
  semver: GluegunSemver
  strings: GluegunStrings
  system: GluegunSystem
  template: GluegunTemplate
  generate: any
  packageManager: GluegunPackageManager
}

export class EmptyToolbox implements GluegunEmptyToolbox {
  [x: string]: any
  public config: Options & { loadConfig?: (name: string, src: string) => Options } = {}

  public result?: any = null
  public parameters?: GluegunParameters = { options: {} }
  public plugin?: Plugin = null
  public command?: Command = null
  public pluginName?: string = null
  public commandName?: string = null
  public runtime?: Runtime = null

  filesystem?: GluegunFilesystem
  http?: GluegunHttp
  meta?: GluegunMeta
  patching?: GluegunPatching
  print?: GluegunPrint
  prompt?: GluegunPrompt
  semver?: GluegunSemver
  strings?: GluegunStrings
  system?: GluegunSystem
  template?: GluegunTemplate
  generate?: any
}

export class Toolbox extends EmptyToolbox implements GluegunToolbox {
  public config: Options = {}
  public parameters: GluegunParameters = { options: {} }

  // known extensions
  filesystem: GluegunFilesystem
  http: GluegunHttp
  meta: GluegunMeta
  patching: GluegunPatching
  print: GluegunPrint
  prompt: GluegunPrompt
  semver: GluegunSemver
  strings: GluegunStrings
  system: GluegunSystem
  template: GluegunTemplate
  generate: any
  packageManager: GluegunPackageManager
}

// Toolbox used to be known as RunContext. This is for backwards compatibility.
export type GluegunRunContext = GluegunToolbox
export type RunContext = Toolbox

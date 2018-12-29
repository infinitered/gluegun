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
  GluegunParameters,
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

export interface GluegunToolbox {
  // known properties
  result?: any
  config?: Options
  parameters: GluegunParameters
  plugin?: Plugin
  command?: Command
  pluginName?: string
  commandName?: string
  runtime?: Runtime

  // known extensions
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

  // our catch-all! since we can add whatever to this object
  [key: string]: any
}

export class Toolbox implements GluegunToolbox {
  [x: string]: any
  public result = null
  public config: Options = {}
  public parameters: GluegunParameters = {
    options: {},
  }
  public plugin?: Plugin = null
  public command?: Command = null
  public pluginName?: string = null
  public commandName?: string = null
  public runtime?: Runtime = null

  // known extensions
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

// Toolbox used to be known as RunContext. This is for backwards compatibility.
export type GluegunRunContext = GluegunToolbox
export type RunContext = Toolbox

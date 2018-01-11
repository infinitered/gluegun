import { Runtime } from '../runtime/runtime'
import { Command } from './command'
import { Options } from './options'
import { Plugin } from './plugin'

export interface RunContextParameters {
  array?: string[]
  options?: Options
  first?: string
  second?: string
  third?: string
  string?: string
  raw?: any
  argv?: any
}

export interface GluegunRunContext {
  // known properties
  result?: any
  error?: any
  config?: object
  parameters: RunContextParameters
  plugin?: Plugin
  command?: Command
  pluginName?: string
  commandName?: string
  runtime?: Runtime

  // known extensions
  filesystem?: any
  http?: any
  meta?: any
  patching?: any
  print?: any
  prompt?: any
  semver?: any
  strings?: any
  system?: any
  template?: any
  generate?: any

  // our catch-all! since we can add whatever to this object
  [key: string]: any
}

export class RunContext implements GluegunRunContext {
  [key: string]: any

  public result
  public error
  public config
  public parameters
  public plugin
  public command
  public pluginName
  public commandName
  public runtime

  constructor() {
    /**
     * The result of the run command.
     */
    this.result = null

    /**
     * An error, if any.
     */
    this.error = null

    /**
     * The configuration.  A mashup of defaults + overrides.
     */
    this.config = {}

    /**
     *  The parameters like the command line options and arguments.
     */
    this.parameters = {}
  }
}

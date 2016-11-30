// @flow
import type { Runtime, Registry } from '../types'

export function createRuntime (options: any = {}): Runtime {
  // provide a way for plugins to do their thing
  const print = options.log || console.log

  // remember the current working directory
  const workingDir = options.workingDir || process.cwd()

  // the configuration file
  const config = {}

  // the location of the config file
  const configPath = options.configPath

  // the list of registries providing features
  const registries: Registry[] = []; // eslint-disable-line

  /**
   * Kicks off a run with an action
   */
  function run (args: string, options: any = {}): void {
    print('running')
  }

  return {
    print,
    workingDir,
    registries,
    config,
    configPath,
    run
  }
}

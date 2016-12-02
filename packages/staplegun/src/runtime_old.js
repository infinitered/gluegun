// @flow
import type { Script, Runtime, Registry } from '../types'
import { load } from './registry-loader'
import { forEach, pipe, flatten, pluck } from 'ramda'

export function createRuntime (options: any = {}): Runtime {
  // provide a way for plugins to do their thing
  const print = options.log || console.log

  // remember the current working directory
  const workingDir = options.workingDir || process.cwd()

  // the location of the config file
  const configPath = options.configPath

  // the list of registries providing features
  const registries: Registry[] = []; // eslint-disable-line

  // try loading the Registry
  const registry: Registry = load(configPath)
  registries.push(registry)

  function getScripts (): Script[] {
    return pipe(
      pluck('scripts'),
      flatten
    )(registries)
  }

  /**
   * Find the scripts which match this value
   */
  const matchScripts = value => {
    const allScripts = getScripts()
  }

  /**
   * Kicks off a run with an action
   */
  function run (args: string, options: any = {}): void {
    forEach(script => {
      print(`Script: ${script.name}`)
      script.handler()
    }, getScripts())
  }

  return {
    config: {},
    print,
    workingDir,
    registries,
    configPath,
    run
  }
}

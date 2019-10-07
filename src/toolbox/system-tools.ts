import { Options } from '../domain/options'
import {
  GluegunSystem,
  GluegunError,
  StringOrBuffer,
  GluegunSpawnOptions,
  GluegunSpawnResult,
  GluegunSystemKeys,
} from './system-types'
import { head, tail } from './utils'
import { ChildProcess, SpawnOptions } from 'child_process'

/**
 * Executes a commandline program asynchronously using child_process#exec.
 *
 * We recommend using `spawn` instead as it supports cross-platform CLIs
 * better and has a more flexible API.
 */
async function run(commandLine: string, options: Options = {}): Promise<any> {
  const trimmer = options && options.trim ? s => s.trim() : s => s
  const { trim, ...nodeOptions } = options // eslint-disable-line @typescript-eslint/no-unused-vars

  return new Promise((resolve, reject) => {
    const { exec } = require('child_process')
    exec(commandLine, nodeOptions, (error: GluegunError, stdout: StringOrBuffer, stderr: StringOrBuffer) => {
      if (error) {
        error.stderr = stderr
        return reject(error)
      }
      resolve(trimmer(stdout || ''))
    })
  })
}

/**
 * Executes a commandline app via execa.
 */
async function exec(commandLine: string, options: Options = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = commandLine.split(' ')
    require('execa')(head(args), tail(args), options)
      .then(result => resolve(result.stdout))
      .catch(error => reject(error))
  })
}

/**
 * Spawns a new process (using the NPM module `cross-spawn`) and provides
 * a nice interface.
 *
 * @param commandLine The command line to execute.
 * @param options Additional cross-spawn options.
 * @returns The response.
 */
async function spawn(commandLine: string, options: GluegunSpawnOptions = {}): Promise<GluegunSpawnResult> {
  return new Promise((resolve, reject) => {
    // we bring in the child_process TypeScript definition here
    // via https://github.com/DefinitelyTyped/DefinitelyTyped/blob/be146d853af634c1b3b44c39ae243898c10d630c/types/node/child_process.d.ts#L196
    const crossSpawn: (command: string, options: SpawnOptions) => ChildProcess = require('cross-spawn')

    // remove spawn-specific options
    const { onInput, ...rest } = options
    const bareOptions: SpawnOptions = rest

    // kick off the process
    const spawned = crossSpawn(commandLine, bareOptions)
    const result: GluegunSpawnResult = {
      stdout: '',
      error: null,
      status: null,
    }

    spawned.stdout.on('data', data => {
      data = data.toString()
      result.stdout += data

      // allow for interactive input / output
      if (options.onInput) {
        Object.entries(options.onInput).map(([match, getInput]) => {
          if (data.includes(match)) {
            // we match some sort of input, so let's write to stdin now
            const input = getInput(data)
            if (input) spawned.stdin.write(input)
          }
        })
      }
    })

    spawned.on('error', err => {
      result.error = err
      // we don't reject as instead we want to
      // handle the error in the main callback function
      // ... this is an API decision so we don't have
      // to wrap everything in try/catch or .catch()
      // but rather just do `if (result.error) // something`
      resolve(result)
    })

    spawned.on('close', code => {
      result.status = code
      resolve(result)
    })
  })
}

/**
 * Finds the location of the path.
 *
 * @param command The name of program you're looking for.
 * @return The full path or null.
 */
function which(command: string): string | null {
  return require('which').sync(command, { nothrow: true })
}

/**
 * Starts a timer used for measuring durations.
 *
 * @return A function that when called will return the elapsed duration in milliseconds.
 */
function startTimer(): () => number {
  const started = process.uptime()
  return () => Math.floor((process.uptime() - started) * 1000) // uptime gives us seconds
}

function keys(): GluegunSystemKeys {
  return require('ansi-escape-sequences')
}

const system: GluegunSystem = { exec, run, spawn, which, keys, startTimer }

export { system, GluegunSystem }

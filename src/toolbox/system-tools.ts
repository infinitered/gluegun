import { Options } from '../domain/options'
import { GluegunSystem, GluegunError, StringOrBuffer } from './system-types'
import { head, tail, isNil } from './utils'

/**
 * Executes a commandline program asynchronously.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
async function run(commandLine: string, options: Options = {}): Promise<any> {
  const trimmer = options && options.trim ? s => s.trim() : s => s
  const { trim, ...nodeOptions } = options

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
 * Executes a commandline via execa.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
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
 * Uses cross-spawn to run a process.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns The response code.
 */
async function spawn(commandLine: string, options: Options = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = commandLine.split(' ')
    const spawned = require('cross-spawn')(head(args), tail(args), options)
    const result = {
      stdout: null,
      status: null,
      error: null,
    }
    if (spawned.stdout) {
      spawned.stdout.on('data', data => {
        if (isNil(result.stdout)) {
          result.stdout = data
        } else {
          result.stdout += data
        }
      })
    }
    spawned.on('close', code => {
      result.status = code
      resolve(result)
    })
    spawned.on('error', err => {
      result.error = err
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

const system: GluegunSystem = { exec, run, spawn, which, startTimer }

export { system, GluegunSystem }

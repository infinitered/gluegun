import { exec as nodeExec } from 'child_process'
import * as crossSpawn from 'cross-spawn'
import * as execa from 'execa'
import { dissoc, head, identity, isNil, split, tail, trim } from 'ramda'
import * as nodeWhich from 'which'
import { Options } from '../domain/options'
import { RunContext } from '../domain/run-context'

/**
 * Extensions to launch processes and open files.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context: RunContext) {
  /**
   * Executes a commandline program asynchronously.
   *
   * @param {string} commandLine The command line to execute.
   * @param {options} options Additional child_process options for node.
   * @returns {Promise}
   */
  async function run(commandLine, options: Options = {}) {
    const trimmer = options && options.trim ? trim : identity
    const nodeOptions = dissoc('trim', options)

    return new Promise((resolve, reject) => {
      nodeExec(commandLine, nodeOptions, (error: any, stdout: string, stderr: string) => {
        if (error) {
          error.stderr = stderr
          reject(error)
        }
        resolve(trimmer(stdout || ''))
      })
    })
  }

  /**
   * Executes a commandline via execa.
   *
   * @param {string} commandLine The command line to execute.
   * @param {options} options Additional child_process options for node.
   * @returns {Promise}
   */
  async function exec(commandLine, options) {
    return new Promise((resolve, reject) => {
      const args = split(' ', commandLine)
      execa(head(args), tail(args), options)
        .then(result => resolve(result.stdout))
        .catch(error => reject(error))
    })
  }

  /**
   * Uses cross-spawn to run a process.
   *
   * @param {any} commandLine The command line to execute.
   * @param {options} options Additional child_process options for node.
   * @returns {Promise} The response code.
   */
  async function spawn(commandLine, options) {
    return new Promise((resolve, reject) => {
      const args = split(' ', commandLine)
      const spawned = crossSpawn(head(args), tail(args), options)
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
   * @param {string} command The name of program you're looking for.
   * @return {string} The full path or null.
   */
  function which(command) {
    return nodeWhich.sync(command)
  }

  /**
   * Starts a timer used for measuring durations.
   *
   * @return {function} A function that when called will return the elapsed duration in milliseconds.
   */
  function startTimer() {
    const started = process.uptime()
    return () => Math.floor((process.uptime() - started) * 1000) // uptime gives us seconds
  }

  context.system = { exec, run, spawn, which, startTimer }
}

module.exports = attach

const { exec: nodeExec } = require('child_process')
const clipboardy = require('clipboardy')
const { isNil, split, head, tail, dissoc, trim, identity } = require('ramda')
const execa = require('execa')
const nodeWhich = require('which')
const crossSpawn = require('cross-spawn')

/**
 * Extensions to launch processes, open files, and talk to the clipboard.
 *
 * @return {Function} A function to attach to the context.
 */
module.exports = function (plugin, command, context) {
  /**
   * Executes a commandline program asynchronously.
   *
   * @param {string} commandLine The command line to execute.
   * @param {options} options Additional child_process options for node.
   * @returns {Promise}
   */
  async function run (commandLine, options = {}) {
    const trimmer = options && options.trim ? trim : identity
    const nodeOptions = dissoc('trim', options)

    return new Promise((resolve, reject) => {
      nodeExec(commandLine, nodeOptions, (error, stdout, stderr) => {
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
  async function exec (commandLine, options) {
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
  async function spawn (commandLine, options) {
    return new Promise((resolve, reject) => {
      const args = split(' ', commandLine)
      const spawned = crossSpawn(head(args), tail(args), options)
      let result = {
        stdout: null,
        status: null,
        error: null
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
   * Returns text that is on the clipboard.
   *
   * @return {string}
   */
  function readFromClipboard () {
    return clipboardy.readSync()
  }

  /**
   * Writes text to the clipboard.
   *
   * @param {string} text The text to send
   */
  function writeToClipboard (text) {
    clipboardy.writeSync(text)
  }

  /**
   * Finds the location of the path.
   *
   * @param {string} command The name of program you're looking for.
   * @return {string} The full path or null.
   */
  function which (command) {
    return nodeWhich.sync(command)
  }

  return { exec, run, spawn, readFromClipboard, writeToClipboard, which }
}

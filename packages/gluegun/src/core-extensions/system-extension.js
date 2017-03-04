const { exec: nodeExec, spawn: nodeSpawn } = require('child_process')
const clipboardy = require('clipboardy')
const { split, head, tail, dissoc, trim, identity } = require('ramda')
const execa = require('execa')
const Shell = require('shelljs')

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
   * Uses Node JS's spawn to run a process.
   *
   * @param {any} commandLine The command line to execute.
   * @param {options} options Additional child_process options for node.
   * @returns {Promise} The response code.
   */
  async function spawn (commandLine, options) {
    return new Promise((resolve, reject) => {
      const args = split(' ', commandLine)
      const spawned = nodeSpawn(head(args), tail(args), options)
      spawned.on('close', function (code) {
        if (code === 0) {
          resolve(code)
        } else {
          reject(code)
        }
      })
      spawned.on('error', () => reject())
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
   * @returns {string} The full path or null.
   */
  function which (command) {
    return Shell.which(command)
  }

  /**
   * Checks if path exists
   *
   * @param {string} path The path you're looking for (directory or file)
   * @returns {string} Returns `null` if not found, or `directory` | `file`
   */
  function exists (path) {
    if (Shell.test('-d', path)) { return 'directory' }
    if (Shell.test('-f', path)) { return 'file' }
    return null
  }

  return { exec, run, spawn, readFromClipboard, writeToClipboard, which, exists }
}

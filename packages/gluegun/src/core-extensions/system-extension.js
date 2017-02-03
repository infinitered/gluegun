const { exec: nodeExec, spawn: nodeSpawn } = require('child_process')
const clipboardy = require('clipboardy')
const { split, head, tail } = require('ramda')
const execa = require('execa')

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
  async function run (commandLine, options) {
    return new Promise((resolve, reject) => {
      nodeExec(commandLine, options, (error, stdout, stderr) => {
        if (error) {
          error.stderr = stderr
          reject(error)
        }
        resolve(stdout)
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

  return { exec, run, spawn, readFromClipboard, writeToClipboard }
}

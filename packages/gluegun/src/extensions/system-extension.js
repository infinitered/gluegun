const { exec } = require('child_process')
const clipboardy = require('clipboardy')

/**
 * Extensions to launch processes, open files, and talk to the clipboard.
 *
 * @return {Function} A function to attach to the context.
 */
module.exports = function (plugin, command, context) {
  /**
   * Executes a commandline program asynchronously.
   */
  async function run (commandLine, options = {}) {
    return new Promise((resolve, reject) => {
      exec(commandLine, options, (error, stdout, stderr) => {
        if (error) {
          error.stderr = stderr
          reject(error)
        }
        resolve(stdout)
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

  return { run, readFromClipboard, writeToClipboard }
}

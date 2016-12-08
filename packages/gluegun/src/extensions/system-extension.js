const { exec } = require('child_process')

/**
 * Extensions to launch processes, open files, and talk to the clipboard.
 *
 * @param  {Plugin}     plugin  The plugin that triggered.
 * @param  {Command}    command The current command that is running.
 * @param  {RunContext} context The running context.
 * @return {Function}           A function to attach to the context.
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

  return { run }
}

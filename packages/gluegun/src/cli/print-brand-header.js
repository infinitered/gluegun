const jetpack = require('fs-jetpack')
const print = require('../utils/print')
const { isFile } = require('../utils/filesystem-utils')
const loadModule = require('../loaders/module-loader')

/**
 * Prints the brand header if we have one.
 */
module.exports = function printBrandHeader (runtime, plugin) {
  const brandPluginDir = `${plugin.directory}/brand`
  const headerTextFile = `${brandPluginDir}/header.txt`
  const headerJsFile = `${brandPluginDir}/header.js`

  // load the javascript header if it exists
  if (isFile(headerJsFile)) {
    const header = loadModule(headerJsFile)
    header(plugin, print)
    return
  }

  // otherwise try printing the text file header
  if (isFile(headerTextFile)) {
    const text = jetpack.read(headerTextFile)
    print.fancy(text)
  }
}

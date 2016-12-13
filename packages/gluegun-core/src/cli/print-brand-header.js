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

  // try loading the javascript header
  try {
    const header = loadModule(headerJsFile)
    header(plugin, print)
    return
  } catch (e) {
  }

  // otherwise try printing the text file header
  if (isFile(headerTextFile)) {
    const text = jetpack.read(headerTextFile)
    print.fancy(text)
  }
}

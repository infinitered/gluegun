// --- Hackasaurus Rex --------------------------------------------------------
//
// https://github.com/patrick-steele-idem/app-module-path-node
// https://gist.github.com/branneman/8048520
//
// This adds the node_modules for `gluegun` to the "search path".
//
// So, wherever folks have their scripts (plugins or their apps), they will be
// given a chance to resolve dependencies back up to gluegun's node_modules.
//
// I may be going to hell for this, but I'm taking you bastards with me.
// ----------------------------------------------------------------------------

// first, do a sniff test to ensure our dependencies are met
const sniff = require('../sniff')

// check the node version
if (!sniff.isNewEnough) {
  console.log(
    'Node.js 7.6+ is required to run. You have ' +
      sniff.nodeVersion +
      '. Womp, womp.'
  )
  process.exit(1)
}

require('app-module-path').addPath(`${__dirname}/../node_modules`)
require('app-module-path').addPath(process.cwd())
// ----------------------------------------------------------------------------

// import a bunch of things we want to make available
const build = require('./domain/builder')
const strings = require('./utils/string-utils')
const print = require('./utils/print')
const printCommands = require('./cli/print-commands')
const printWtf = require('./cli/print-wtf')
const { subdirectories } = require('./utils/filesystem-utils')

// bring in a few extensions to make available for stand-alone purposes
const filesystem = require('./core-extensions/filesystem-extension')()
const semver = require('./core-extensions/semver-extension')()
const system = require('./core-extensions/system-extension')()
const prompt = require('./core-extensions/prompt-extension')()
const http = require('./core-extensions/http-extension')()
const template = require('./core-extensions/template-extension')()
const patching = require('./core-extensions/patching-extension')()

// export our API
module.exports = {
  build,
  print,
  strings,
  printCommands,
  printWtf,
  subdirectories,
  filesystem,
  semver,
  system,
  prompt,
  http,
  template,
  patching
}

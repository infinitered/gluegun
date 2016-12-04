import parseCommandLine from './parse-command-line'
import { forEach } from 'ramda'
import { isBlank } from './utils'
import jetpack from 'fs-jetpack'
import getPluginDirectoriesFromPackage from './plugins-from-package'
import Runtime from './runtime'
import print from './print'
import printBanner from './print-banner'
import printCommands from './print-commands'
import printCommandLineOptions from './print-command-line-options'

/**
 * Our main entry point.
 *
 * This is async because our runtime execution is.
 */
async function run () {
  // parse the command line into what we need
  const { namespace, args, options } = parseCommandLine()

  // create the runtime
  const runtime: Runtime = new Runtime()

  // add any plugins for the current directory
  runtime.addPluginFromDirectory(jetpack.cwd())

  // add any plugins from the package.json in the current directory too
  forEach(
    runtime.addPluginFromDirectory,
    getPluginDirectoriesFromPackage(jetpack.cwd())
  )

  printCommandLineOptions(namespace, args, options)

  // let's do this!
  const context = await runtime.run(namespace, args, options)

  // print
  if (isBlank(namespace)) {
    printBanner()
  }

  if (isBlank(context.fullArguments)) {
    printCommands(runtime)
  }

  // print.debug(context, 'run context')
}

run()

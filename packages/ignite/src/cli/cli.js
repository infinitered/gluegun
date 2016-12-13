const { build } = require('gluegun-core')
const header = require('../brand/header')

/**
 * Kick off a run.
 *
 * @param  {array}      argv An array of command line arguments.
 * @return {RunContext}      The gluegun RunContext
 */
module.exports = async function run (argv) {
  header()

  // create a runtime
  const runtime = build()
    .brand('ignite')
    .loadAll(`${__dirname}/../plugins`)
    .createRuntime()

  // run the command
  const context = await runtime.run()

  // send it back to make testing easier
  return context
}

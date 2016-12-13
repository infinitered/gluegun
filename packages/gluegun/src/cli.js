const { Runtime } = require('gluegun-core')

const BRAND = 'gluegun'

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  // create a runtime
  const runtime = new Runtime(BRAND)

  // and run it
  await runtime.run()
}

module.exports = run

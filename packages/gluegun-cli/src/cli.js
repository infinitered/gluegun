const { build } = require('gluegun-core')

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  // create a runtime
  const runtime = build()
    .brand('gluegun')
    .createRuntime()

  // and run it
  const context = await runtime.run()

  // send it back
  return context
}

module.exports = run

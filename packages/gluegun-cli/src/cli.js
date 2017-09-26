const { build } = require('gluegun')

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  // create a runtime
  const runtime =
    build()
    .brand('gluegun')
    .loadDefault(`${__dirname}`)
    .defaultCommand('help')
    .token('commandName', 'cliName')
    .token('commandDescription', 'cliDescription')
    .token('commandAlias', 'cliAlias')
    .createRuntime()

  // and run it
  let context
  try {
    context = await runtime.run(argv)
  } catch (e) {
    console.log(e)
  }

  // send it back
  return context
}

module.exports = run

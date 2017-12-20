const { build } = require('../index.js')

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  // create a CLI runtime
  const cli = build()
    .brand('gluegun')
    .src(`${__dirname}`)
    .help()
    .version()
    .create()

  // and run it
  const context = await cli.run(argv)

  // send it back (for testing, mostly)
  return context
}

module.exports = run

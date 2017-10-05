const { build } = require('gluegun')

/**
 * Create the cli and kick it off
 */
async function run (argv) {
  // create a CLI runtime
  const cli =
    build()
    .brand('gluegun')
    .src(`${__dirname}`)
    // .plugin('~/Desktop/some-gluegun-plugin')
    .plugins('./node_modules', { matching: 'gluegun-*', hidden: true })
    .create()

  // and run it
  const context = await cli.run()

  // send it back (for testing, mostly)
  return context
}

module.exports = run

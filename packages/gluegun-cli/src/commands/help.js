// @cliDescription  Provides help for Gluegun.
// @cliAlias h
// ----------------------------------------------------------------------------

async function command(context) {
  const { print, printCommands } = context

  print.info('Gluegun CLI')
}

module.exports = command

module.exports = {
  name: 'help',
  alias: [ 'h' ],
  description: 'Displays this help',
  hidden: false,
  run: (context) => {
    const { info, printCommands } = context.print

    info('GlueGun CLI')
    printCommands(context)

    return 'helped'
  }
}

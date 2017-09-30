module.exports = {
  name: 'help',
  run: (context) => {
    const { info, printCommands } = context.print

    info('GlueGun CLI')
    printCommands(context, ['generate'])

    return 'generate helped'
  }
}

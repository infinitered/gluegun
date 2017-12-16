module.exports = {
  name: 'gluegun',
  description: 'Run the gluegun CLI',
  run: context => {
    context.print.printHelp(context)
    return 'default command'
  }
}

export default {
  name: 'help',
  alias: 'h',
  dashed: true,
  run: context => {
    context.print.printHelp(context)
  },
}

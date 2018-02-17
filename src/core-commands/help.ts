export default {
  name: 'help',
  alias: 'h',
  dashed: true,
  run: toolbox => {
    toolbox.print.printHelp(toolbox)
  },
}

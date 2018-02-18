export default {
  name: 'version',
  alias: 'v',
  description: 'Output the version number',
  dashed: true,
  run: toolbox => {
    toolbox.print.info(toolbox.meta.version())
  },
}

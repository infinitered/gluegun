export default {
  name: 'version',
  alias: 'v',
  description: 'Output the version number',
  dashed: true,
  run: context => {
    context.print.info(context.meta.version())
  },
}

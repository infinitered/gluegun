module.exports = {
  name: 'version',
  alias: 'v',
  dashed: true,
  run: context => {
    context.print.info(context.meta.version())
  }
}

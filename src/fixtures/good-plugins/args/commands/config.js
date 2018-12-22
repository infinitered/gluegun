function config(toolbox) {
  return toolbox.config.args.color || 'red'
}

module.exports = {
  name: 'config',
  run: config,
}

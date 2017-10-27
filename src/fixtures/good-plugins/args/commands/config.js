function config (context) {
  return context.config.args.color || 'red'
}

module.exports = { name: 'config', run: config }

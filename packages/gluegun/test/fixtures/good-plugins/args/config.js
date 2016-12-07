function config (context) {
  return context.config.args.color || 'red'
}

module.exports = config

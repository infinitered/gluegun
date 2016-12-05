function config (context) {
  return context && context.config && context.config.color || 'red'
}

module.exports = config

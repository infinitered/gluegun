const cosmiconfig = require('cosmiconfig')

function loadConfig (name, src) {
  const cosmic = cosmiconfig(name, { sync: true }).load(src)
  const config = (cosmic && cosmic.config) || {}
  return config
}

module.exports = { loadConfig }

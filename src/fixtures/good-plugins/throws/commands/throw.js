async function thrower(toolbox) {
  throw new Error('thrown an error!')
}

module.exports = { name: 'throw', run: thrower }

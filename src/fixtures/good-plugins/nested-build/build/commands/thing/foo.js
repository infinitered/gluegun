module.exports = {
  name: 'foo',
  alias: 'f',
  run: toolbox => `nested thing foo in build folder has run with ${toolbox.nestedBuild}`,
}

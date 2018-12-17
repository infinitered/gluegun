async function hello(toolbox) {
  const name = toolbox.parameters.string
  if (name) {
    return `hi ${name}`
  } else {
    return 'hi'
  }
}

module.exports = { name: 'hello', alias: 'h', run: hello }

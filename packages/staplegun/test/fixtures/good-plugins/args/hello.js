async function hello (context) {
  const name = context.parameters.string
  if (name) {
    return `hi ${name}`
  } else {
    return 'hi'
  }
}

module.exports = hello

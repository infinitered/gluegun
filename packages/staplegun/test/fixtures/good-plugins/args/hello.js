async function hello (context) {
  const name = context && context.stringArguments
  if (name) {
    return `hi ${name}`
  } else {
    return 'hi'
  }
}

module.exports = hello

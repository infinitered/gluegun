export default async (context) => {
  const name = context && context.stringArguments
  if (name) {
    return `hi ${name}`
  } else {
    return 'hi'
  }
}

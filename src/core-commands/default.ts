export default {
  run: ({ parameters, runtime, print, strings, meta }) => {
    const infoMessage = strings.isBlank(parameters.first)
      ? `Welcome to ${print.colors.cyan(runtime.brand)} CLI version ${meta.version()}!`
      : `Sorry, didn't recognize that command!`
    print.info(`
  ${infoMessage}
  Type ${print.colors.magenta(`${runtime.brand} --help`)} to view common commands.`)
  },
}

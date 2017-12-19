module.exports = {
  run: ({ runtime, print }) => {
    print.info(`
  Sorry, didn't recognize that command!
  Type ${print.colors.magenta(`${runtime.brand} --help`)} to view common commands.`)
  }
}

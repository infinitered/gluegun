// @cliCommand say
// @cliDescription Says hello.

module.exports = {
  name: 'hello',
  run: async function (context) {
    return 'hello'
  }
}

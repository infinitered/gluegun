// @cliDescription Adds a remote plugin.

const {
  split,
  pipe,
  when,
  always
} = require('ramda')

module.exports = async function (context) {
  const { print, parameters, system, strings } = context
  const { isBlank } = strings

  // validate
  const [org, repo] = pipe(
    when(isBlank, always('')),
    split('/')
  )(parameters.first)

  // failed validation?
  if (isBlank(org) || isBlank(repo)) {
    print.error('GitHub org/repo required.')
    return
  }

  // where this clone will be placed
  const destDir = `${context.runtime.brand}/plugins-remote/${repo}`

  // the git command
  const command = `git clone git@github.com:${org}/${repo} --bare ${destDir}`

  // run!
  try {
    print.info('cloning')
    await system.run(command)
  } catch (e) {
    print.error(e.stderr)
  }
}

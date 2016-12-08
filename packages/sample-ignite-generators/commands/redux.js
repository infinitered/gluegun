// ----------------------------------------------------------------------------
// @command      generate redux
// @description  Generates a action/creator/reducer set for Redux.
// ----------------------------------------------------------------------------
const { isNilOrEmpty } = require('ramdasauce')
const { capsCase } = require('../shared/utils')

module.exports = async function (context) {
  // grab some features
  const { parameters, config, template } = context
  const { generate } = template

  // TODO: validation
  if (isNilOrEmpty(parameters.string)) return

  // read some configuration
  const { tests } = config.ignite

  // make a name that's FriendlyLikeThis and not-like-this
  const name = capsCase(parameters.first)
  const props = { name }

  // generate the React component
  await generate({
    template: 'templates/redux.njk',
    target: `App/Redux/${name}Redux.js`,
    props
  })

  // generate the appropriate test
  if (tests) {
    await generate({
      template: `templates/redux-test-${tests}.njk`,
      target: `Tests/Redux/${name}ReduxTest.js`,
      props
    })
  }
}

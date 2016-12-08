// @command      generate screen
// @description  Generates an opinionated container.
const { isNilOrEmpty } = require('ramdasauce')
const { capsCase } = require('../shared/utils')

module.exports = async function (context) {
  // grab some features
  const { parameters, config, template } = context
  const { generate } = template

  // TODO: validation
  if (isNilOrEmpty(parameters.string)) return

  // read some configuration
  const { askToOverwrite } = config.ignite
  console.log(config)

  // make a name that's FriendlyLikeThis and not-like-this
  const name = capsCase(parameters.first)
  const props = { name }

  // generate the smart component
  await generate({
    template: 'templates/screen.njk',
    target: `App/Containers/${name}Screen.js`,
    props,
    askToOverwrite
  })

  // generate the style
  await generate({
    template: 'templates/screen-style.njk',
    target: `App/Containers/Styles/${name}ScreenStyle.js`,
    props,
    askToOverwrite
  })
}

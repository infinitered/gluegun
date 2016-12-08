// ----------------------------------------------------------------------------
// @command      generate container
// @description  Generates a redux smart component.
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
  const { askToOverwrite } = config.ignite

  // make a name that's FriendlyLikeThis and not-like-this
  const name = capsCase(parameters.first)
  const props = { name }

  // generate the smart component
  await generate({
    template: 'templates/container.njk',
    target: `App/Containers/${name}.js`,
    props,
    askToOverwrite
  })

  // generate the style
  await generate({
    template: 'templates/container-style.njk',
    target: `App/Containers/Styles/${name}Style.js`,
    props,
    askToOverwrite
  })
}

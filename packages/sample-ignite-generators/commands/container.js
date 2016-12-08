// ----------------------------------------------------------------------------
// @cliCommand      generate container
// @cliDescription  Generates a redux smart component.
// ----------------------------------------------------------------------------
const { isNilOrEmpty } = require('ramdasauce')

module.exports = async function (context) {
  // grab some features
  const { parameters, template, strings } = context
  const { generate } = template
  const { pascalCase } = strings

  // TODO: validation
  if (isNilOrEmpty(parameters.string)) return

  // make a name that's FriendlyLikeThis and not-like-this
  const name = pascalCase(parameters.first)
  const props = { name }

  // generate the smart component
  await generate({
    template: 'container.njk',
    target: `App/Containers/${name}.js`,
    props
  })

  // generate the style
  await generate({
    template: 'container-style.njk',
    target: `App/Containers/Styles/${name}Style.js`,
    props
  })
}

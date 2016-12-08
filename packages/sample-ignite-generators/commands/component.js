// ----------------------------------------------------------------------------
// @command      generate component
// @description  Generates a component, styles, and an optional test.
// ----------------------------------------------------------------------------
const { isNilOrEmpty } = require('ramdasauce')

module.exports = async function (context) {
  // grab some features
  const { parameters, config, template, strings } = context
  const { generate } = template
  const { pascalCase } = strings

  // TODO: validation
  if (isNilOrEmpty(parameters.array)) return

  // read some configuration
  const { tests } = config['ignite-basic-generators']

  // make a name that's FriendlyLikeThis and not-like-this
  const name = pascalCase(parameters.first)
  const props = { name }

  // generate the React component
  await generate({
    template: 'component.njk',
    target: `App/Components/${name}.js`,
    props
  })

  // generate the style
  await generate({
    template: 'component-style.njk',
    target: `App/Components/Styles/${name}Style.js`,
    props
  })

  // generate the AVA test
  if (tests === 'ava') {
    await generate({
      template: 'component-test.njk',
      target: `Tests/Components/${name}Test.js`,
      props
    })
  }
}

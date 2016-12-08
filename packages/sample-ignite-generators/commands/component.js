// ----------------------------------------------------------------------------
// @command      generate component
// @description  Generates a component, styles, and an optional test.
// ----------------------------------------------------------------------------
const { isNilOrEmpty } = require('ramdasauce')
const { capsCase } = require('../shared/utils')

module.exports = async function (context) {
  // grab some features
  const { parameters, config, template } = context
  const { generate } = template

  // TODO: validation
  if (isNilOrEmpty(parameters.array)) return

  // read some configuration
  const { tests } = config.ignite

  // make a name that's FriendlyLikeThis and not-like-this
  const name = capsCase(parameters.first)
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

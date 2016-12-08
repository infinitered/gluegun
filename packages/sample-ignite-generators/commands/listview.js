// @command      generate listview
// @description  Generates a screen with a ListView + walkthrough.
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

  // which type of grid?
  const message = 'What kind of ListView would you like to generate?'
  const choices = [
    { name: 'Row', value: 'row' },
    { name: 'With Sections', value: 'sections' },
    { name: 'Grid', value: 'grid' }
  ]

  // pick one
  let type = parameters.options.type
  if (isNilOrEmpty(type)) {
    // TODO: prompt
    type = type || choices[0].value
  }

  // set appropriate templates to generate
  const componentTemplate = type === 'sections' ? 'listview-sections' : 'listview'
  const styleTemplate = type === 'grid' ? 'listview-grid-style' : 'listview-style'

  // generate the React component
  await generate({
    template: `templates/${componentTemplate}.njk`,
    target: `App/Containers/${name}.js`,
    props,
    askToOverwrite
  })

  // generate the style
  await generate({
    template: `templates/${styleTemplate}.njk`,
    target: `App/Containers/Styles/${name}Style.js`,
    props,
    askToOverwrite
  })
}

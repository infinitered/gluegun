// @command      generate screen
// @description  Generates an opinionated container.
const { isNilOrEmpty } = require('ramdasauce')
const { capsCase } = require('../shared/utils')

module.exports = async function (context) {
  // grab some features
  const { parameters, template } = context
  const { generate } = template

  // TODO: validation
  if (isNilOrEmpty(parameters.string)) return

  // make a name that's FriendlyLikeThis and not-like-this
  const name = capsCase(parameters.first)
  const props = { name }

  // generate the smart component
  await generate({
    template: 'screen.njk',
    target: `App/Containers/${name}Screen.js`,
    props
  })

  // generate the style
  await generate({
    template: 'screen-style.njk',
    target: `App/Containers/Styles/${name}ScreenStyle.js`,
    props
  })
}

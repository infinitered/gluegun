// ----------------------------------------------------------------------------
// @cliCommand      generate component
// @cliDescription  Generates a component, styles, and an optional test.
// ----------------------------------------------------------------------------
const { isNilOrEmpty } = require('ramdasauce')

module.exports = async function (context) {
  // grab some features
  const { parameters, config, template, strings, prompt, filesystem, print } = context
  const { confirm } = prompt
  const { generate } = template
  const { pascalCase } = strings

  // TODO: validation
  if (isNilOrEmpty(parameters.array)) return

  // read some configuration
  const { tests, askToOverwrite } = config.ignite

  // make a name that's FriendlyLikeThis and not-like-this
  const name = pascalCase(parameters.first)
  const props = { name }

  // a bunch of files
  const targetComponent = `App/Components/${name}.js`
  const targetStyle = `App/Components/Styles/${name}Style.js`
  const targetTest = `Tests/Components/${name}Test.js`

  // If the file exists
  const shouldGenerate = async (target) => {
    if (!askToOverwrite) return true
    if (!filesystem.exists(target)) return true
    return await confirm(`overwrite ${target}`)
  }

  // generate the React component
  if (await shouldGenerate(targetComponent)) {
    await generate({
      template: 'component.njk',
      target: targetComponent,
      props
    })
    print.info(`${print.checkmark} ${targetComponent}`)
  }

  // generate the style
  if (await shouldGenerate(targetStyle)) {
    await generate({
      template: 'component-style.njk',
      target: targetStyle,
      props
    })
    print.info(`${print.checkmark} ${targetStyle}`)
  }

  // generate the AVA test
  if (tests === 'ava' && await shouldGenerate(targetTest)) {
    await generate({
      template: 'component-test.njk',
      target: targetTest,
      props
    })
    print.info(`${print.checkmark} ${targetTest}`)
  }
}

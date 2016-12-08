// ----------------------------------------------------------------------------
// @cliCommand      generate saga
// @cliDescription  Generates a saga with an optional test.
// ----------------------------------------------------------------------------
const { isNilOrEmpty } = require('ramdasauce')

module.exports = async function (context) {
  // grab some features
  const { parameters, config, template, strings } = context
  const { generate } = template
  const { pascalCase } = strings

  // TODO: validation
  if (isNilOrEmpty(parameters.string)) return

  // read some configuration
  const { tests } = config['ignite-basic-generators']

  // make a name that's FriendlyLikeThis and not-like-this
  const name = pascalCase(parameters.first)
  const props = { name }

  // generate the saga
  await generate({
    template: 'saga.njk',
    target: `App/Sagas/${name}Sagas.js`,
    props
  })

  // generate the appropriate test
  if (tests) {
    await generate({
      template: `saga-test-${tests}.njk`,
      target: `Tests/Saga/${name}SagaTest.js`,
      props
    })
  }
}

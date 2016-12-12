// @cliDescription Initializes your project with $BRAND.

module.exports = async function (context) {
  // grab some features
  const {
    print: { success },
    filesystem: { copy },
    template: { generate }
  } = context

  // should we customize this?
  const gluegunDirectoryName = context.runtime.brand

  // copy the template directory over
  copy(
    `${__dirname}/../templates/gluegun-dir`,
    gluegunDirectoryName,
    { overwrite: true, matching: ['!*.toml.ejs'] }
  )

  // generate the project gluegun.toml
  await generate({
    template: `gluegun-dir/gluegun.toml.ejs`,
    target: `${gluegunDirectoryName}/${context.runtime.brand}.toml`
  })

  // generate the example plugin gluegun.toml
  await generate({
    template: `gluegun-dir/plugins/example/gluegun.toml.ejs`,
    target: `${gluegunDirectoryName}/plugins/example/${context.runtime.brand}.toml`,
    props: {
      exampleDir: `${gluegunDirectoryName}/plugins/example`
    }
  })

  success(`Your project is now ready to use ${context.runtime.brand}.`)
}

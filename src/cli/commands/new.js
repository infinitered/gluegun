module.exports = {
  name: 'new',
  alias: ['n', 'create'],
  description: 'Creates a new gluegun cli',
  hidden: false,
  run: async context => {
    const { parameters, template, filesystem, print, strings, system } = context
    const { generate } = template
    const { kebabCase } = strings

    const props = {
      name: parameters.first,
      typescript: parameters.options.typescript
    }

    if (!props.name || props.name.length === 0) {
      print.error('You must provide a valid CLI name.')
      print.error('Example: gluegun new foo')
      return
    } else if (!/^[a-z0-9-]+$/.test(props.name)) {
      const validName = kebabCase(props.name)
      print.error(`${props.name} is not a valid name. Use lower-case and dashes only.`)
      print.error(`Suggested: gluegun new ${validName}`)
      return
    }

    await filesystem.dir(props.name)

    let active = []

    // executable is treated specially
    active.push(
      generate({
        template: `cli/bin/cli-executable.ejs`,
        target: `./${props.name}/bin/${props.name}`,
        props: props
      })
    )

    const files = [
      'docs/commands.md.ejs',
      'docs/plugins.md.ejs',
      'src/commands/generate.js.ejs',
      'src/extensions/cli-extension.js.ejs',
      'src/templates/model.js.ejs.ejs',
      'src/cli.js.ejs',
      'LICENSE.ejs',
      '.prettierrc.ejs',
      'package.json.ejs',
      'readme.md.ejs',
      '.gitignore.ejs'
    ]

    if (props.typescript) {
      files.push('tsconfig.json.ejs')
    }

    active = files.reduce((prev, file) => {
      const template = `cli/${file}`

      const target =
        `${props.name}/` +
        (props.typescript && file.includes('.js.ejs')
          ? file.replace('.js.ejs', '.ts')
          : file.replace('.ejs', ''))

      const gen = generate({ template, target, props })
      return prev.concat([gen])
    }, active)

    // let all generator calls run in parallel
    await Promise.all(active)

    // make bin executable
    filesystem.chmodSync(`${props.name}/bin/${props.name}`, '755')

    await system.spawn(`cd ${props.name} && npm i && npm run format`, {
      shell: true,
      stdio: 'inherit',
      stderr: 'inherit'
    })
    print.info(`cd ${props.name} && npm i && npm format`)

    print.info(`Generated ${props.name} CLI.`)
    print.info(``)
    print.info(`Next:`)
    print.info(`  $ cd ${props.name}`)
    print.info(`  $ npm link`)
    print.info(`  $ ${props.name} help`)
    print.info(``)

    // for tests
    return `new ${context.parameters.first}`
  }
}

export default {
  name: 'new',
  alias: ['n', 'create'],
  description: 'Creates a new gluegun cli',
  hidden: false,
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      filesystem,
      print,
      strings,
      system,
    } = toolbox
    const { kebabCase } = strings

    const props = {
      name: parameters.first,
      typescript: parameters.options.typescript,
      extension: parameters.options.typescript ? 'ts' : 'js',
    }

    if (!props.name || props.name.length === 0) {
      print.error('You must provide a valid CLI name.')
      print.error('Example: gluegun new foo')
      return undefined
    } else if (!/^[a-z0-9-]+$/.test(props.name)) {
      const validName = kebabCase(props.name)
      print.error(`${props.name} is not a valid name. Use lower-case and dashes only.`)
      print.error(`Suggested: gluegun new ${validName}`)
      return undefined
    }

    await filesystem.dir(props.name)

    let active = []

    // executable is treated specially
    active.push(
      generate({
        template: `cli/bin/cli-executable.ejs`,
        target: `./${props.name}/bin/${props.name}`,
        props,
      }),
    )

    const files = [
      '__tests__/cli-integration.test.js.ejs',
      'docs/commands.md.ejs',
      'docs/plugins.md.ejs',
      'src/commands/generate.js.ejs',
      'src/commands/default.js.ejs',
      'src/extensions/cli-extension.js.ejs',
      'src/templates/model.js.ejs.ejs',
      'src/cli.js.ejs',
      'LICENSE.ejs',
      'package.json.ejs',
      'readme.md.ejs',
      '.gitignore.ejs',
    ]

    if (props.typescript) {
      files.push('tsconfig.json.ejs')
      files.push('tslint.json.ejs')
    }

    active = files.reduce((prev, file) => {
      const template = `cli/${file}`

      const target =
        `${props.name}/` +
        (props.typescript && file.includes('.js.ejs') ? file.replace('.js.ejs', '.ts') : file.replace('.ejs', ''))

      const gen = generate({ template, target, props })
      return prev.concat([gen])
    }, active)

    // let all generator calls run in parallel
    await Promise.all(active)

    // make bin executable
    filesystem.chmodSync(`${props.name}/bin/${props.name}`, '755')

    // rename default.js to project name
    const ext = props.typescript ? 'ts' : 'js'
    filesystem.rename(`${props.name}/src/commands/default.${ext}`, `${props.name}.${ext}`)

    // install with yarn or npm i
    const yarnOrNpm = system.which('yarn') ? 'yarn' : 'npm'

    await system.spawn(`cd ${props.name} && ${yarnOrNpm} install --silent && ${yarnOrNpm} run --quiet format`, {
      shell: true,
      stdio: 'inherit',
      stderr: 'inherit',
    })

    print.info(`Generated ${props.name} CLI.`)
    print.info(``)
    print.info(`Next:`)
    print.info(`  $ cd ${props.name}`)
    print.info(`  $ ${yarnOrNpm} test`)
    print.info(`  $ ${yarnOrNpm} link`)
    print.info(`  $ ${props.name}`)
    print.info(``)

    // for tests
    return `new ${toolbox.parameters.first}`
  },
}

import { GluegunCommand } from '../../domain/command'
import { GluegunToolbox } from '../../domain/toolbox'
import { PackageManager } from '../../toolbox/package-manager-types'

type TemplateProps = {
  name: string
  packageManager: PackageManager | 'ask'
}

const NewCommand: GluegunCommand = {
  name: 'new',
  alias: ['n', 'create'],
  description: 'Creates a new gluegun cli',
  hidden: false,
  run: async (toolbox: GluegunToolbox) => {
    // retrieve the tools we need
    const {
      parameters,
      template: { generate },
      filesystem,
      print: { error, info, colors },
      strings: { kebabCase },
      system,
      meta,
      prompt,
      packageManager,
    } = toolbox

    // set up initial props (to pass into templates)
    const o = parameters.options
    const bun = Boolean(o.bun)
    const yarn = Boolean(o.yarn)
    const npm = Boolean(o.npm)

    const props: TemplateProps = {
      name: parameters.first,
      packageManager: bun ? 'bun' : yarn ? 'yarn' : npm ? 'npm' : 'ask',
    }

    // sanity checks
    if (!props.name || props.name.length === 0) {
      error('You must provide a valid CLI name.')
      error('Example: gluegun new movies')
      return `invalid cli name: ${props.name}`
    } else if (!/^[a-z0-9-]+$/.test(props.name)) {
      const validName = kebabCase(props.name)
      error(`${props.name} is not a valid name. Use lower-case and dashes only.`)
      error(`Suggested: gluegun new ${validName}`)
      return `invalid cli name: ${props.name}`
    }

    if (filesystem.exists(props.name)) {
      info(``)
      error(`There's already a folder named ${props.name} here.`)
      const answer = await prompt.confirm(`Do you want to overwrite it?`)
      if (answer) {
        filesystem.remove(props.name)
      } else {
        return `folder exists: ${props.name}`
      }
    }

    if (props.packageManager === 'ask') {
      info(``)

      const choices = ['npm']
      if (packageManager.has('yarn')) choices.unshift('yarn')
      if (packageManager.has('bun')) choices.unshift('bun')

      if (choices.length > 1) {
        const { answer } = await prompt.ask({
          type: 'select',
          name: 'answer',
          message: 'Which package manager would you like to use?',
          choices,
        })

        props.packageManager = (answer || choices[0]) as PackageManager
      } else {
        props.packageManager = choices[0] as PackageManager
      }

      info(`Package manager used: ${props.packageManager}`)
    }

    const managerExists = packageManager.has(props.packageManager)
    if (!managerExists) {
      error(``)
      error(`We couldn't find ${props.packageManager} on your system.`)
      error(`Please install it and try again.`)
      error(``)
      return `package manager not found: ${props.packageManager}`
    }

    // create the directory
    filesystem.dir(props.name)

    // active generators, for parallel generation
    let active = []

    // executable is treated specially
    active.push(
      generate({
        template: `cli/bin/cli-executable.ejs`,
        target: `./${props.name}/bin/${props.name}`,
        props,
      }),
    )

    // all the template files we'll use to generate the CLI
    const files = [
      '__tests__/cli-integration.test.ts.ejs',
      'docs/commands.md.ejs',
      'docs/plugins.md.ejs',
      'src/commands/generate.ts.ejs',
      'src/commands/default.ts.ejs',
      'src/extensions/cli-extension.ts.ejs',
      'src/templates/model.ts.ejs.ejs',
      'src/cli.ts.ejs',
      'src/types.ts.ejs',
      'LICENSE.ejs',
      'package.json.ejs',
      'README.md.ejs',
      '.gitignore.ejs',
      'tsconfig.json.ejs',
    ]

    // render all templates
    active = files.reduce((prev, file) => {
      const template = `cli/${file}`
      const target = `${props.name}/${file.replace('.ejs', '')}`
      const gen = generate({ template, target, props })
      return prev.concat([gen])
    }, active)

    // let all generator calls run in parallel
    await Promise.all(active)

    // make bin executable
    filesystem.chmodSync(`${props.name}/bin/${props.name}`, '755')

    // rename default.js to project name
    filesystem.rename(`${props.name}/src/commands/default.ts`, `${props.name}.ts`)

    // install with bun or yarn or npm i

    const manager = packageManager.which(['bun', 'yarn', 'npm'])
    await system.spawn(`cd ${props.name} && ${manager} install --silent && ${manager} run format`, {
      shell: true,
      stdio: 'inherit',
    })

    // we're done, so show what to do next
    info(``)
    info(colors.green(`Generated ${props.name} CLI with Gluegun ${meta.version()}.`))
    info(colors.gray(`Using TypeScript`))
    info(``)
    info(`Next:`)
    info(`  $ cd ${props.name}`)
    info(`  $ ${props.packageManager} test`)
    info(`  $ ${props.packageManager} link`)
    info(`  $ ${props.name}`)
    info(``)
    info(colors.gray(`Since your project uses TypeScript, we've included a build script.`))
    info(colors.gray(`When you link and run the project, it will use ts-node or bun locally to test.`))
    info(colors.gray(`However, you can test the generated JavaScript locally like this:`))
    info(``)
    info(`  $ ${props.packageManager} build`)
    info(`  $ ${props.name} --compiled-build`)
    info(``)

    // for tests
    return `new ${toolbox.parameters.first}`
  },
}

export default NewCommand

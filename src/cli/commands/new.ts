import { GluegunCommand } from '../../domain/command'
import { GluegunToolbox } from '../../domain/toolbox'

type TemplateProps = {
  name: string
  language: 'typescript' | 'javascript' | 'ask'
  extension: 'ts' | 'js' | undefined
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
    } = toolbox

    // set up initial props (to pass into templates)
    const o = parameters.options
    const ts = Boolean(o.typescript || o.ts || o.t)
    const js = Boolean(o.javascript || o.js || o.j)

    const props: TemplateProps = {
      name: parameters.first,
      language: ts ? 'typescript' : js ? 'javascript' : 'ask',
      extension: undefined,
    }

    // sanity checks
    if (!props.name || props.name.length === 0) {
      error('You must provide a valid CLI name.')
      error('Example: gluegun new movies')
      return undefined
    } else if (!/^[a-z0-9-]+$/.test(props.name)) {
      const validName = kebabCase(props.name)
      error(`${props.name} is not a valid name. Use lower-case and dashes only.`)
      error(`Suggested: gluegun new ${validName}`)
      return undefined
    }

    if (filesystem.exists(props.name)) {
      info(``)
      error(`There's already a folder named ${props.name} here.`)
      const answer = await prompt.confirm(`Do you want to overwrite it?`)
      if (answer) {
        filesystem.remove(props.name)
      } else {
        return undefined
      }
    }

    // typescript or javascript?
    if (props.language === 'ask') {
      info(``)
      const { answer } = await prompt.ask({
        type: 'select',
        name: 'answer',
        message: 'Which language would you like to use?',
        choices: [
          'TypeScript - Gives you a build pipeline out of the box (default)',
          'Modern JavaScript - Node 8.2+ and ES2016+ (https://node.green/)',
        ],
      })

      // we default to TypeScript if they just press "enter"
      const lang = (answer && answer.toLowerCase()) || 'typescript'

      props.language = lang.includes('typescript') ? 'typescript' : 'javascript'
      info(`Language used: ${props.language === 'typescript' ? 'TypeScript' : 'Modern JavaScript'}`)
    }

    props.extension = props.language === 'typescript' ? 'ts' : 'js'

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

    if (props.language === 'typescript') {
      files.push('src/types.js.ejs')
      files.push('tsconfig.json.ejs')
      files.push('tslint.json.ejs') // TODO: swap out TSlint for ESlint in generated CLIs
    }

    // rename js files to ts
    active = files.reduce((prev, file) => {
      const template = `cli/${file}`

      const target =
        `${props.name}/` +
        (props.language === 'typescript' && file.includes('.js.ejs')
          ? file.replace('.js.ejs', '.ts')
          : file.replace('.ejs', ''))

      const gen = generate({ template, target, props })
      return prev.concat([gen])
    }, active)

    // let all generator calls run in parallel
    await Promise.all(active)

    // make bin executable
    filesystem.chmodSync(`${props.name}/bin/${props.name}`, '755')

    // rename default.js to project name
    const ext = props.language === 'typescript' ? 'ts' : 'js'
    filesystem.rename(`${props.name}/src/commands/default.${ext}`, `${props.name}.${ext}`)

    // install with yarn or npm i
    const yarnOrNpm = system.which('yarn') ? 'yarn' : 'npm'
    await system.spawn(`cd ${props.name} && ${yarnOrNpm} install --silent && ${yarnOrNpm} run --quiet format`, {
      shell: true,
      stdio: 'inherit',
    })

    // we're done, so show what to do next
    info(``)
    info(colors.green(`Generated ${props.name} CLI with Gluegun ${meta.version()}.`))
    if (props.language === 'typescript') info(colors.gray(`Using TypeScript`))
    info(``)
    info(`Next:`)
    info(`  $ cd ${props.name}`)
    info(`  $ ${yarnOrNpm} test`)
    info(`  $ ${yarnOrNpm} link`)
    info(`  $ ${props.name}`)
    info(``)
    if (props.language === 'typescript') {
      info(colors.gray(`Since you generated a TypeScript project, we've included a build script.`))
      info(colors.gray(`When you link and run the project, it will use ts-node locally to test.`))
      info(colors.gray(`However, you can test the generated JavaScript locally like this:`))
      info(``)
      info(`  $ ${yarnOrNpm} build`)
      info(`  $ ${props.name} --compiled-build`)
      info(``)
    }

    // for tests
    return `new ${toolbox.parameters.first}`
  },
}

export default NewCommand

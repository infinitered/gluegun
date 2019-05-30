import { build, GluegunToolbox } from '../index'

/**
 * Create the cli and kick it off
 */
export async function run(argv?: string[] | string): Promise<GluegunToolbox> {
  // create a CLI runtime
  const gluegunCLI = build('gluegun')
    .src(__dirname)
    .help()
    .version()
    .defaultCommand({
      run: async (toolbox: GluegunToolbox) => {
        const { print, meta } = toolbox
        print.info(`Gluegun version ${meta.version()}`)
        print.info(``)
        print.info(`  Type gluegun --help for more info`)
      },
    })
    .exclude(['http', 'patching'])
    .checkForUpdates(25)
    .create()

  // and run it
  const toolbox = await gluegunCLI.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

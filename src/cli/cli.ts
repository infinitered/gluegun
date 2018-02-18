import { build, GluegunToolbox } from '../index'

/**
 * Create the cli and kick it off
 */
export async function run(argv?: string[] | string): Promise<GluegunToolbox> {
  // create a CLI runtime
  const cli = build()
    .brand('gluegun')
    .exclude(['semver', 'system', 'prompt', 'http'])
    .src(`${__dirname}`)
    .help()
    .version()
    .create()

  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

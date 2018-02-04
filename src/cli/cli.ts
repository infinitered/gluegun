import { build, GluegunRunContext } from '../index'

/**
 * Create the cli and kick it off
 */
export async function run(argv?: string[] | string): Promise<GluegunRunContext> {
  // create a CLI runtime
  const cli = build()
    .brand('gluegun')
    .src(`${__dirname}`)
    .help()
    .version()
    .create()

  // and run it
  const context = await cli.run(argv)

  // send it back (for testing, mostly)
  return context
}

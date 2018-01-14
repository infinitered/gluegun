import * as cosmiconfig from 'cosmiconfig'
import { Options } from '../domain/options'

const COSMIC_OPTIONS = {
  sync: true, // load the config synchronously
  rcExtensions: true, // allow .namerc.yaml and .namerc.json as well
}

/**
 * Loads the config for the app via CosmicConfig by searching in a few places.
 *
 * @param name The base name of the config to load.
 * @param src The directory to look in.
 */
export function loadConfig(name: string, src: string): Options {
  // attempt to load
  const cosmic: Options = cosmiconfig(name, COSMIC_OPTIONS).load(src)

  // use what we found or fallback to an empty object
  const config = (cosmic && cosmic.config) || {}
  return config
}

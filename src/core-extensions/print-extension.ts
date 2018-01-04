import * as print from '../toolbox/print-tools'

/**
 * Extensions to print to the console.
 *
 * @param  {RunContext} context The running context.
 */
function attach(context) {
  // attach the feature set
  context.print = print
}

module.exports = attach

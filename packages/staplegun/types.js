// @flow

export type ActionArguments = Array<string>
export type ActionOptions = { [key: string]: any }

// The action is the user's request to run a command.
export type Action = {
  // the name of the command we're attempting to target
  type: string,

  // Additional arguments a plugin might need.
  //
  // For example, if file generator plugin might create the file User.js
  // when it sees: ['User'].
  arguments: ActionArguments,

  // Flags or options that further qualify options.
  //
  // For example, { overwrite: true }, might be used by a file generator
  // to clobber a file without prompting the user.
  options: ActionOptions
}

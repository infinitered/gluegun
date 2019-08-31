export interface GluegunSystem {
  /**
   * Executes a command via execa.
   */
  exec(command: string, options?: any): Promise<any>
  /**
   * Runs a command and returns stdout as a trimmed string.
   */
  run(command: string, options?: any): Promise<string>
  /**
   * Spawns a command via crosspawn.
   */
  spawn(command: string, options?: any): Promise<any>
  /**
   * Uses node-which to find out where the command lines.
   */
  which(command: string): string | void
  /**
   * Returns a timer function that starts from this moment. Calling
   * this function will return the number of milliseconds from when
   * it was started.
   */
  startTimer(): GluegunTimer
}

/**
 * Returns the number of milliseconds from when the timer started.
 */
export type GluegunTimer = () => number

export type StringOrBuffer = string | Buffer

export interface GluegunError extends Error {
  stderr?: StringOrBuffer
}

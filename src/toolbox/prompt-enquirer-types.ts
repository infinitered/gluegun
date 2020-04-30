// imported from https://github.com/enquirer/enquirer/blob/9eef2ed3b4b6222985e4eb85098d3c5a3b2b8b93/index.d.ts
export interface BasePromptOptions {
  name: string | (() => string)
  type: string | (() => string)
  message: string | (() => string) | (() => Promise<string>)
  initial?: any
  required?: boolean
  format?(value: string): string | Promise<string>
  result?(value: string): string | Promise<string>
  skip?: ((state: object) => boolean | Promise<boolean>) | boolean
  validate?(value: string): boolean | Promise<boolean> | string | Promise<string>
  onSubmit?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  onCancel?(name: string, value: any, prompt: Enquirer.Prompt): boolean | Promise<boolean>
  stdin?: NodeJS.ReadStream
  stdout?: NodeJS.WriteStream
}

export interface Choice {
  name: string
  message?: string
  value?: string
  hint?: string
  disabled?: boolean | string
}

export interface ArrayPromptOptions extends BasePromptOptions {
  type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale'
    | 'rawlist' // deprecated
    | 'expand' // deprecated
    | 'checkbox' // deprecated
    | 'radio' // deprecated
    | 'question' // deprecated
  choices: string[] | Choice[]
  maxChoices?: number
  multiple?: boolean
  initial?: number
  delay?: number
  separator?: boolean
  sort?: boolean
  linebreak?: boolean
  edgeLength?: number
  align?: 'left' | 'right'
  scroll?: boolean
  suggest?: (input: string, choices: Choice[]) => Choice[]
}

export interface BooleanPromptOptions extends BasePromptOptions {
  type: 'confirm'
  initial?: boolean
}

export interface StringPromptOptions extends BasePromptOptions {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text'
  initial?: string
  multiline?: boolean
}

export interface NumberPromptOptions extends BasePromptOptions {
  type: 'numeral'
  min?: number
  max?: number
  delay?: number
  float?: boolean
  round?: boolean
  major?: number
  minor?: number
  initial?: number
}

export interface SnippetPromptOptions extends BasePromptOptions {
  type: 'snippet'
  newline?: string
}

export interface SortPromptOptions extends BasePromptOptions {
  type: 'sort'
  hint?: string
  drag?: boolean
  numbered?: boolean
}

export type PromptOptions =
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions
  | NumberPromptOptions
  | SnippetPromptOptions
  | SortPromptOptions
  | BasePromptOptions

declare class BasePrompt extends NodeJS.EventEmitter {
  constructor(options?: PromptOptions)

  render(): void

  run(): Promise<any>
}

declare class Enquirer<T = object> extends NodeJS.EventEmitter {
  constructor(options?: object, answers?: T)

  /**
   * Register a custom prompt type.
   *
   * @param type
   * @param fn `Prompt` class, or a function that returns a `Prompt` class.
   */
  register(type: string, fn: typeof BasePrompt | (() => typeof BasePrompt)): this

  /**
   * Register a custom prompt type.
   */
  register(type: { [key: string]: typeof BasePrompt | (() => typeof BasePrompt) }): this

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * @param questions Options objects for one or more prompts to run.
   */
  prompt(
    questions:
      | PromptOptions
      | ((this: Enquirer) => PromptOptions)
      | (PromptOptions | ((this: Enquirer) => PromptOptions))[],
  ): Promise<T>

  /**
   * Use an enquirer plugin.
   *
   * @param plugin Plugin function that takes an instance of Enquirer.
   */
  use(plugin: (this: this, enquirer: this) => void): this
}

declare namespace Enquirer {
  function prompt<T = object>(
    questions:
      | PromptOptions
      | ((this: Enquirer) => PromptOptions)
      | (PromptOptions | ((this: Enquirer) => PromptOptions))[],
  ): Promise<T>

  class Prompt extends BasePrompt {}
}

export { Enquirer }

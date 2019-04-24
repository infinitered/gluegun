import { PromptOptions, Choice } from './prompt-enquirer-types'

const Enquirer = require('enquirer')
export type GluegunEnquirer = typeof Enquirer
export const GluegunEnquirer = Enquirer

export interface GluegunPrompt {
  /* Prompts with a confirm message. */
  confirm(message: string): Promise<boolean>
  /* Prompts with a set of questions. */
  ask<T = object>(
    questions:
      | PromptOptions
      | ((this: GluegunEnquirer) => PromptOptions)
      | (PromptOptions | ((this: GluegunEnquirer) => PromptOptions))[],
  ): Promise<GluegunAskResponse>
  /* Returns a separator. */
  separator(): string
}

export interface GluegunQuestionChoices extends Choice {}

export type GluegunQuestionType = PromptOptions

export interface GluegunAskResponse {
  [key: string]: string
}

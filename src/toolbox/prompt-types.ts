import { prompt } from './prompt-tools'

export interface GluegunPrompt {
  /* Prompts with a confirm message. */
  confirm(message: string): Promise<boolean>
  /* Prompts with a set of questions. */
  ask(questions: GluegunQuestionType | GluegunQuestionType[]): Promise<GluegunAskResponse>
  /* Returns a separator. */
  separator(): string
}

export interface GluegunQuestionChoices {
  key: string
  name: string
  value?: string
}

export interface GluegunQuestionType {
  type: string
  name: string
  message: string
  // optional
  suggest?: Function
  limit?: number
  highlight?: Function
  multiple?: boolean
  choices?: string[] | GluegunQuestionChoices[]
  default?: string
  skip?: boolean | Function
  initial?: string | Function
  format?: Function
  result?: Function
  validate?: Function
}

export interface GluegunAskResponse {
  [key: string]: string
}

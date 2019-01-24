export interface GluegunPrompt {
  /* Prompts with a confirm message. */
  confirm(message: string): Promise<boolean>
  /* Prompts with a set of questions. */
  ask(questions: GluegunQuestionType | GluegunQuestionType[]): Promise<GluegunAskResponse>
  /* Returns a separator. */
  separator(): string
}

interface GluegunQuestionType {
  type: string
  name: string
  message: string
  choices?: string[]
  default?: string
}

interface GluegunAskResponse {
  [key: string]: string
}

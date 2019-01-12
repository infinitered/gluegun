export interface GluegunPrompt {
  /* Prompts with a confirm message. */
  confirm(message: string): Promise<boolean>
  /* Prompts with a set of questions. */
  ask(questions: QuestionType): AskResponse
  /* Returns a separator. */
  separator(): string
}

interface QuestionType {
  type: string
  name: string
  message: string
  choices?: string[]
  default?: string
}

interface AskResponse {
  [key: string]: string
}

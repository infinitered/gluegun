export interface GluegunPrompt {
  /* Prompts with a confirm message. */
  confirm(message: string): Promise<boolean>
  /* Prompts with a set of questions. */
  ask(questions: any): any
  /* Returns a separator. */
  separator(): string
}

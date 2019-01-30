export interface GluegunTemplate {
  generate(options: GluegunTemplateGenerateOptions): Promise<string>
}

export interface GluegunTemplateGenerateOptions {
  /**
   * Path to the EJS template relative from the plugin's `template` directory.
   */
  template: string
  /**
   * Path to create the file relative from the user's working directory.
   */
  target?: string
  /**
   * Additional props to provide to the EJS template.
   */
  props?: { [name: string]: any }
  /**
   * An absolute path of where to find the templates (if not default).
   */
  directory?: string
}

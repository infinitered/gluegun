import { ApisauceInstance, ApisauceConfig } from 'apisauce'

export interface GluegunHttp {
  /* An apisauce instance. */
  create(options: ApisauceConfig): ApisauceInstance
}

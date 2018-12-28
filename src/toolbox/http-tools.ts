import { GluegunHttp } from './http-types'

const http: GluegunHttp = { create: options => require('apisauce').create(options) }

export { http, GluegunHttp }

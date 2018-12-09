import * as expect from 'expect'
import * as http from 'http'
import { Toolbox } from '../domain/toolbox'
import createExtension from './http-extension'

const toolbox = new Toolbox()
createExtension(toolbox)
const ext = toolbox.http

/**
 * Sends a HTTP response.
 *
 * @param res - The http response object.
 * @param statusCode - The http response status code.
 * @param body - The reponse data.
 */
const sendResponse = (res: any, statusCode: number, body: string) => {
  res.writeHead(statusCode)
  res.write(body)
  res.end()
}

/**
 * Sends a 200 OK with some data.
 *
 * @param res - The http response object.
 * @param body - The http response data.
 */
const send200 = (res: any, body?: string) => {
  sendResponse(res, 200, body || '<h1>OK</h1>')
}

test('has the proper interface', () => {
  expect(ext).toBeTruthy()
  expect(typeof ext.create).toBe('function')
})

test('connects to a server', async () => {
  const server = http.createServer((req, res) => {
    send200(res, 'hi')
  })
  server.listen()
  const { port } = server.address() as any
  const api = ext.create({
    baseURL: `http://127.0.0.1:${port}`,
  })
  const response = await api.get('/')
  expect(response.data).toBe('hi')
})

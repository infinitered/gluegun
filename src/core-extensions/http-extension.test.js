const test = require('ava')
const createExtension = require('./http-extension')
const http = require('http')

const context = {}
createExtension(context)
const ext = context.http

/**
 * Sends a HTTP response.
 *
 * @param {*} res - The http response object.
 * @param {number} statusCode - The http response status code.
 * @param {string} body - The reponse data.
 */
const sendResponse = (res, statusCode, body) => {
  res.writeHead(statusCode)
  res.write(body)
  res.end()
}

/**
 * Sends a 200 OK with some data.
 *
 * @param {*} res - The http response object.
 * @param {string} body - The http response data.
 */
const send200 = (res, body) => {
  sendResponse(res, 200, body || '<h1>OK</h1>')
}

test('has the proper interface', t => {
  t.truthy(ext)
  t.is(typeof ext.create, 'function')
})

test('connects to a server', async t => {
  const server = http.createServer((req, res) => {
    send200(res, 'hi')
  })
  server.listen()
  const port = server.address().port
  const api = ext.create({
    baseURL: `http://127.0.0.1:${port}`
  })
  const response = await api.get('/')
  t.is(response.data, 'hi')
})

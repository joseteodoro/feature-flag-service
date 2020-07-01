const http = require('http')
const supertest = require('supertest')
const { createServer } = require('../../../../server/server')

let _server, _agent
async function startTestServer () {
  const app = await createServer()
  _server = http.createServer(app.callback())
  await new Promise((resolve, reject) => _server.listen(0, (err) => err ? reject(err) : resolve()))
  const agent = supertest(_server)
  agent.app = app
  return agent
}

async function getTestServer () {
  return _agent || (_agent = await startTestServer())
}

before(() => getTestServer())

after(done => _server ? _server.close(done) : done())

module.exports = getTestServer

const http = require('http')
// @ts-ignore
const app = require(API_ENTRY)

const originalConsoleLog = console.log

console.log = (...args: any) => {
  if (typeof args[0] !== 'string' || !args[0].startsWith('[HMR]')) {
    originalConsoleLog(...args)
  }
}

let listener = app.default
const server = http.createServer(listener)

server.listen(4000)
// @ts-ignore
;(module as any).hot.accept(API_ENTRY, () => {
  server.removeListener('request', listener)
  // @ts-ignore
  listener = require(API_ENTRY).default
  server.on('request', listener)
})

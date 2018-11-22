global.Promise = require('bluebird')

const {port} = require('./config')
const app = require('./app')
const realtime = require('./realtime')
const server = require('http').createServer(app)

realtime.attach(server)

server.listen(port, ok => {
  console.log(`Server listening on ${port} port`)
})

process.on('SIGINT', () => {
  realtime.close(() => {
    server.close(() => {
      process.exit()
    })
  })
})
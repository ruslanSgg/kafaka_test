const IO = require('socket.io')
const config = require('../config')
const redisAdapter = require('socket.io-redis')
const {redisPub, redisSub} = require('./redis')

const conf = {
  serveClient: false,
  adapter: redisAdapter({
    key: `sio-${config.stage}`,
    pubClient: redisPub,
    subClient: redisSub,
  }),
  transports: ['websocket'],
  pingTimeout: 30 * 1000,
  pingInterval: 20 * 1000,
}

module.exports = IO(conf)

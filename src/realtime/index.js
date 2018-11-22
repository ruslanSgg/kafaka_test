
const socketIO = require('../services/socket-io')
const {host, port} = require('../config')
const Game = require('../services/game')

socketIO.on('connection', socket => {
  let game = new Game(socket)

  socket.on('disconnect', () => {
    game.destroy()
    console.log('Client disconnected: ', socket.id)
  })

  socket.emit('fantasy:live', { timestamp: Date.now(), msg: `Connect to ${host}:${port}`});

})


module.exports = socketIO

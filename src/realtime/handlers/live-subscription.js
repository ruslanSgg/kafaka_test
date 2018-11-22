const whitelist = {
  teams: 'ft',
  fantasy: 'fantasy',
  tournaments: 't',
  seasons: 'live-results',
  events: 'events',
}

function subscribeLive(socket) {
  return function(data) {
    let rooms = []
    Object.keys(data).forEach(k => {
      if(whitelist[k] && data[k].length) {
        rooms = rooms.concat(data[k].map(id => `${whitelist[k]}/${id}`))
      }
    })
    if(rooms.length) socket.join(rooms)
    console.log('subscribeLive', rooms)
  }
}

function unsubscribeLive(socket) {
  return function(data = {}) {
    Object.keys(data).forEach(k => {
      if(whitelist[k]) {
        if(data[k] === true) {
          Object.keys(socket.rooms)
            .filter(name => name.startsWith(`${whitelist[k]}/`))
            .forEach(name => socket.leave(name))
        } else if(data[k].length) {
          data[k].forEach(id => socket.leave(`${whitelist[k]}/${id}`))
        }
      }
    })
  }
}

module.exports = {subscribeLive, unsubscribeLive}

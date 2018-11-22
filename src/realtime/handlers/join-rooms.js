const _ = require('lodash')
const jwt = require('jsonwebtoken')
const {Knex} = require('../../db/read')

let whiteLabels
module.exports = function(socket) {
  return async function({whiteLabel, token}) {
    let rooms = []
    if(!whiteLabels) {
      whiteLabels = await Knex.select('id', 'name', 'secret_key')
        .where('active', true)
        .from('white_labels')
        .then(rows => _.keyBy(rows, 'name'))
    }
    if(!whiteLabels[whiteLabel]) return
    rooms.push(['white-label', 'id', whiteLabels[whiteLabel].id].join('/'))
    rooms.push(['white-label', 'name', whiteLabel].join('/'))
    if(!token) return socket.join(rooms)
    jwt.verify(
      token,
      whiteLabels[whiteLabel].secret_key,
      (err, payload) => {
        console.log('User connect: ', err, payload)
        if(err || !(payload && payload.id)) return
        rooms.push([whiteLabel, 'user', (payload.sub || payload.id)].join('/'))
        rooms.push([whiteLabel, 'role', payload.role].join('/'))
        if(_.includes(['translator', 'admin'], payload.role)) {
          rooms.push('translations')
        }
        socket.join(rooms)
      }
    )
  }
}

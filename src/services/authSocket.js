const _ = require('lodash')
const jwt = require('jsonwebtoken')
const {Knex} = require('../db/read')

let whiteLabels
module.exports = async function({whiteLabel, token}) {
    if(!whiteLabels) {
      whiteLabels = await Knex.select('id', 'name', 'secret_key')
        .where('active', true)
        .from('white_labels')
        .then(rows => _.keyBy(rows, 'name'))
    }
    if(!whiteLabels[whiteLabel]) return
    if(!token) return
    return jwt.verify(
      token,
      whiteLabels[whiteLabel].secret_key,
      (err, payload) => {
        if(err || !(payload && payload.id)) return
        return {user: payload, whiteLabel: whiteLabels[whiteLabel]}
      }
    )
  }

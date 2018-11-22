const config = require('config-node')

let defaults = config({ env: 'default', dir: __dirname })

/* istanbul ignore next */
try {
  module.exports = config({
    env: process.env.NODE_ENV || 'development',
    dir: __dirname,
  })
} catch (err) {
  console.log(err, err.stack)
  module.exports = defaults
}

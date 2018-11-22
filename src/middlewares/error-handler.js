const path = require('path')
const _ = require('lodash')
const logger = require('../services/logger')('handler')

// for now return requestId for production
// should be just exclude staging here
const UNKNOWN = process.env.NODE_ENV === 'production' &&
  !['fanteam'].includes(process.env.SITE_ID)


const silencerPath = path.join(__dirname, '..', '..')
function silencer(stack) {
  return _(stack.split("\n"))
    .reject(ln => ln.includes('/node_modules/'))
    .reject(ln => !ln.includes(silencerPath))
    .value()
    .join("\n")
}

module.exports = (err, req, res, next) => {
  let requestId = req.sentry || res.get('X-Request-Id')
  let ret = {}
  if(err.status && err.status !== 500) {
    ret = {
      error: err.message,
      message: err.message,
      details: err.details,
    }
  } else {
    logger.error("%s: %s \n%s\n%j", requestId, err.message, silencer(err.stack), err)
    if(UNKNOWN) {
      ret = {
        requestId,
        error: `Unknown error: ${requestId}`,
        message: `Unknown error: ${requestId}`,
      }
    } else {
      ret = Object.assign({}, err, {
        requestId,
        error: err.error || err.message,
        message: err.message || err.error,
        details: err.details,
      })
    }
  }

  res.status(err.status || 500)
    .json(ret)
}

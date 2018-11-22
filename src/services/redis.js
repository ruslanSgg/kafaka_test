const qs = require('qs')
const Redis = require('ioredis')
const config = require('../config').redis

function getRedis(opts = {}) {
  let client
  if(config.sentinels) {
    Object.assign(opts, {
      name: config.name,
      sentinels: config.sentinels
        .split(',')
        .map(t => ({host: t.trim()})),
      db: config.db,
    })
    client = Redis.createClient(opts)
  } else {
    client = Redis.createClient(config.url, opts)
  }
  client.client('setname', 'core-' + (opts.key || 'main'))
  return client
}

const redis = getRedis()
const redisRead = getRedis({key: 'read', role: 'slave'})
const redisPub = getRedis({key: 'pub'})
const redisSub = getRedis({key: 'sub'})

module.exports = {
  getRedis,
  redis,
  redisRead,
  redisPub,
  redisSub,
}

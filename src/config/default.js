const {parse} = require('pg-connection-string')
const DATABASE_URL = process.env.DATABASE_URL || `postgresql://localhost/fanteam_core`

module.exports = {
  host: 'http://localhost',
  port: process.env.PORT || 5001,
  stage: process.env.SITE_ID || process.env.NODE_ENV || 'development',
  database: parse(DATABASE_URL),
  readDatabase: parse(process.env.READ_DATABASE_URL || DATABASE_URL),

  kafkaConfig: {
    url: 'localhost:9092',
    topic: 'live-fantasy'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    db: +(process.env.REDIS_DATABASE || 0),
    sentinels: process.env.REDIS_SENTINELS || '',
    name: process.env.SENTINEL_MASTER || 'mymaster',
  },
}
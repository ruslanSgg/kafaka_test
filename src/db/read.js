const DB = require('knex')
const config = require('../config')

const readDatabase = config.readDatabase.database
  ? config.readDatabase
  : config.database

const Knex = DB({
  client: 'pg',
  connection: readDatabase,
  asyncStackTraces: (config.env === 'development'),
  acquireConnectionTimeout: 30000,
  pool: { min: 0, max: 10 },
})

exports.Knex = Knex

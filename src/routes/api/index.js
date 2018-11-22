const router = require('express').Router()

router.use('/kafka', require('./kafka'))
router.use('/state', require('./state'))

module.exports = router

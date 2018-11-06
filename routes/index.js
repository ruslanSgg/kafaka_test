const router = require('express').Router()

router.use('/api', require('./api'))
router.use('/', require('./pages'));

module.exports = router

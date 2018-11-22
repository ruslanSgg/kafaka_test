const router = require('express').Router()
const errorHandler = require('../middlewares/error-handler')

router.use('/api', require('./api'))
router.use('/', require('./pages'));
// router.use(errorHandler)

module.exports = router


const router = require('express').Router()

router.get('/', require('./show'))
router.post('/sendMsg', require('./create'))

module.exports = router

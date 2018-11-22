const router = require('express').Router()

router.get('/:id', require('./show'))
router.patch('/:id', require('./create'))

module.exports = router

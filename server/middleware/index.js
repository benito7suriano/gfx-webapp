const router = require('express').Router()
module.exports = router

router.use(require('./bodyParsing'))
router.use(require('./logging'))
router.use(require('./static'))


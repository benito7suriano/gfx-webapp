const router = require('express').Router()
module.exports = router

// route for api's
router.use('/api', require('./api'))

// route for auth
// router.use('/auth', require('./auth'))


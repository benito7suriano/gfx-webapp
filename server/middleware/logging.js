const router = require('express').Router()
const morgan = require('morgan')
module.exports = router

// Loggin middleware
router.use(morgan('dev'))


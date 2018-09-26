const router = require('express').Router()
const path = require('path')
module.exports = router

// Static middleware
app.use(express.static(path.join(__dirname, '..', '..', 'public')))
